import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary, uploadBufferOnCloudinary, destroyFromCloudinary } from "../utils/cloudinary.js";
import { userMessage, authMessage, serverFile } from "../utils/commonMessages.js";
import { STATUS_CODE } from "../utils/statusCode.js";
import { logger } from "../utils/logger.js";
export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async generateAccessTokenAndRefreshToken(userId) {
    try {
      const user = await this.userRepository.findById(userId);
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
    } catch {
      throw new ApiError(
        STATUS_CODE.SERVER_ERROR,
        serverFile.SERVER_ERROR
      );
    }
  }

  async uploadFile(localPath, buffer, folder) {
    try {
      if (buffer) {
        return await uploadBufferOnCloudinary(buffer, folder);
      }
      if (localPath) {
        return await uploadOnCloudinary(localPath, folder);
      }
      return null;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        STATUS_CODE.SERVER_ERROR,
        serverFile.SERVER_ERROR, [], err.stack);
    }
  }

  async deleteFile(publicId, resourceType) {
    if (!publicId) return null;
    return await destroyFromCloudinary(publicId, resourceType);
  }

  async createUser(
    fullName,
    email,
    username,
    password,
    avatarImageBuffer,
    coverImageBuffer
  ) {
    const user = await this.userRepository.findByUsernameOrEmail(username, email);
    if (user) {
      throw new ApiError(
        STATUS_CODE.CONFLICT,
        userMessage.USER_EXIST
      )
    };
    const avatar = await this.uploadFile(null, avatarImageBuffer, "avatar");
    let coverImage;
    try {
      coverImage = coverImageBuffer
        ? await this.uploadFile(null, coverImageBuffer, "cover-image")
        : undefined;
      const user = await this.userRepository
        .createUser(
          {
            fullName,
            email,
            username,
            password,
            avatar: { url: avatar.url, publicId: avatar.publicId },
            coverImage: coverImage
              ? { url: coverImage.url, publicId: coverImage.publicId }
              : undefined,
          }
        );
      return user;
    } catch (error) {
      console.error("Error creating user:", error.message);
      await this.deleteFile(avatar.publicId, "image");
      if (coverImage) {
        await this.deleteFile(coverImage.publicId, "image");
      }
      throw new ApiError(
        STATUS_CODE.SERVER_ERROR,
        serverFile.SERVER_ERROR,
      );
    }
  }

  async userLogin(username, email, password) {
    const user = await this.userRepository.findByUsernameOrEmail(username, email);
    if (!user) {
      throw new ApiError(
        STATUS_CODE.NOT_FOUND,
        authMessage.USER_NOT_FOUND
      )
    };
    const isCorrectPassword = await user.isPasswordCorrect(password);
    if (!isCorrectPassword) {
      throw new ApiError(
        STATUS_CODE.UNAUTHORIZED,
        authMessage.INVALID_CREDENTIALS
      )
    };
    const token = await this.generateAccessTokenAndRefreshToken(user._id)
    const { accessToken, refreshToken } = token;
    const loggedInUser = await this.userRepository.findByIdSafe(user._id);
    return { accessToken, refreshToken, loggedInUser };
  }

  async logoutUser(userId) {
    await this.userRepository.clearRefreshToken(userId);
  }

  async refreshAccessToken(incomingRefreshToken) {
    if (!incomingRefreshToken) {
      throw new ApiError(
        STATUS_CODE.UNAUTHORIZED,
        authMessage.TOKEN_REQUIRED
      )
    };
    let decodedToken;
    try {
      decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRETE);
    } catch {
      throw new ApiError(
        STATUS_CODE.UNAUTHORIZED,
        authMessage.INVALID_REFRESH_TOKEN);
    }
    const user = await this.userRepository.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(
        STATUS_CODE.UNAUTHORIZED,
        authMessage.USER_NOT_FOUND
      )
    };
    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(
        STATUS_CODE.UNAUTHORIZED,
        authMessage.INVALID_REFRESH_TOKEN);
    }
    return this.generateAccessTokenAndRefreshToken(user._id);
  }

  async changeCurrentPassword(userId, oldPassword, newPassword) {
    const user = await this.userRepository.findByIdWithPassword(userId);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
      throw new ApiError(
        STATUS_CODE.BAD_REQUEST,
        userMessage.INCORRECT_PASSWORD
      );
    }
    user.password = newPassword;
    await this.userRepository.saveUser(user);
  }

  async updateAccountDetails(userId, { fullName, email }) {
    const updateData = {
      ...(fullName !== undefined && { fullName }),
      ...(email !== undefined && { email }),
    };
    if (updateData.email) {
      const existingUser = await this.userRepository.findByUsernameOrEmail(updateData.email);
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        throw new ApiError(
          STATUS_CODE.CONFLICT,
          userMessage.USER_EXIST
        );
      }
    }
    const updatedUser = await this.userRepository.updateUser(userId, updateData);
    if (!updatedUser) {
      throw new ApiError(
        STATUS_CODE.NOT_FOUND,
        userMessage.USER_NOT_FOUND
      );
    }
    return updatedUser;
  }

  async updateUserAvatar(userId, avatarImageBuffer) {
    const user = await this.userRepository.findById(userId);
    const oldAvatarPublicId = user.avatar?.publicId;
    logger.info(`Old avatar publicId: ${oldAvatarPublicId}`);
    const newAvatar = await this.uploadFile(null, avatarImageBuffer, "avatar");

    let updatedUser;
    try {
      updatedUser = await this.userRepository.updateAvatar(userId, {
        url: newAvatar.url,
        publicId: newAvatar.publicId
      });
    } catch (error) {
      await this.deleteFile(newAvatar.publicId);
      logger.error("Failed to cleanup orphan avatar", error.message);
      throw new ApiError(
        STATUS_CODE.SERVER_ERROR,
        serverFile.FILE_UPLOAD_FAILED
      );
    };
    if (oldAvatarPublicId) {
      await this.deleteFile(oldAvatarPublicId, "image");
    }
    return updatedUser;
  }

  async updateUserCoverImage(userId, coverImageLocalPath) {
    const user = await this.userRepository.findById(userId);
    const oldCoverImagePublicId = user.coverImage?.publicId;
    const newCoverImage = await this.uploadFile(null, coverImageLocalPath, "cover-image");

    let updatedUser;
    try {
      updatedUser = await this.userRepository.updateUser(userId, {
        url: newCoverImage.url,
        publicId: newCoverImage.publicId,
      });
    } catch (error) {
      await this.deleteFile(newCoverImage.publicId, "image");
      logger.error("Failed to cleanup orphan cover image", error.message);
      throw new ApiError(
        STATUS_CODE.SERVER_ERROR,
        serverFile.FILE_UPLOAD_FAILED);
    }
    if (oldCoverImagePublicId) {
      await this.deleteFile(oldCoverImagePublicId, "image");
    }
    return updatedUser;
  }

  async getUserChannelProfile(username, currentUserId) {
    if (!username?.trim()) {
      throw new ApiError(
        STATUS_CODE.BAD_REQUEST,
        userMessage.USERNAME_MISSING
      );
    }
    const channel = await this.userRepository.getUserChannelProfile(username, currentUserId);
    if (!channel?.length) {
      throw new ApiError(
        STATUS_CODE.BAD_REQUEST,
        userMessage.CHANNEL_NOT_FOUND);
    }
    return channel[0];
  }

  async getWatchHistory(userId) {
    const result = await this.userRepository.getWatchHistory(userId);
    return result[0]?.watchHistory || [];
  }
}