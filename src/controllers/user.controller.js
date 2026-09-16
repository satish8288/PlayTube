import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { userMessage } from "../utils/commonMessages.js";
import { STATUS_CODE } from "../utils/statusCode.js";
import { accessTokenOptions, refreshTokenOptions } from "../utils/cookie.utils.js";
export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  userRegister = asyncHandler(
    async (req, res) => {
      const data = req.body;
      const avatarImageBuffer = req.files?.avatar?.[0]?.buffer;
      const coverImageBuffer = req.files?.coverImage?.[0]?.buffer;
      const createdUser = await this.userService
        .createUser(
          data.fullName,
          data.email,
          data.username,
          data.password,
          avatarImageBuffer,
          coverImageBuffer
        );
      res
        .status(STATUS_CODE.CREATED)
        .json(new ApiResponse(STATUS_CODE.CREATED, createdUser, userMessage.USER_CREATED));
    }
  );

  loginUser = asyncHandler(
    async (req, res) => {
      const data = req.body;
      const { accessToken, refreshToken, loggedInUser } = await this.userService
        .userLogin(data.username, data.email, data.password);
      res
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .status(STATUS_CODE.SUCCESS)
        .json(new ApiResponse(STATUS_CODE.SUCCESS, loggedInUser, userMessage.LOGIN_SUCCESS));
    }
  );

  logoutUser = asyncHandler(
    async (req, res) => {
      await this.userService.logoutUser(req.user._id);
      res
        .clearCookie("accessToken", accessTokenOptions)
        .clearCookie("refreshToken", refreshTokenOptions)
        .status(STATUS_CODE.SUCCESS)
        .json(new ApiResponse(STATUS_CODE.SUCCESS, {}, userMessage.LOGOUT_SUCCESS));
    }
  )

  getCurrentUser = asyncHandler(
    async (req, res) => {
      res
        .status(STATUS_CODE.SUCCESS)
        .json(new ApiResponse(STATUS_CODE.SUCCESS, req.user, userMessage.FETCH_PROFILE));
    }
  )

  refreshAccessToken = asyncHandler(
    async (req, res) => {
      const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
      const { accessToken, refreshToken } = await this.userService
        .refreshAccessToken(incomingRefreshToken);
      res
        .status(STATUS_CODE.SUCCESS)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .json(
          new ApiResponse(
            STATUS_CODE.SUCCESS,
            { accessToken, refreshToken },
            userMessage.NEW_TOKEN
          )
        );
    }
  )

  changeCurrentPassword = asyncHandler(
    async (req, res) => {
      const { oldPassword, newPassword } = req.body;
      await this.userService.changeCurrentPassword(req.user._id, oldPassword, newPassword);
      res
        .status(STATUS_CODE.SUCCESS)
        .json(new ApiResponse(STATUS_CODE.SUCCESS, {}, userMessage.CHANGE_PASSWORD));
    }
  )

  updateAccountDetails = asyncHandler(
    async (req, res) => {
      const { fullName, email } = req.body;
      const updatedUser = await this.userService
        .updateAccountDetails(req.user._id, { fullName, email });
      res
        .status(STATUS_CODE.SUCCESS)
        .json(new ApiResponse(STATUS_CODE.SUCCESS, updatedUser, userMessage.USER_UPDATED));
    }
  )

  updateUserAvatar = asyncHandler(
    async (req, res) => {
      const avatarImageBuffer = req.file?.buffer;
      const updatedUser = await this.userService
        .updateUserAvatar(req.user._id, avatarImageBuffer);
      res
        .status(STATUS_CODE.SUCCESS)
        .json(new ApiResponse(STATUS_CODE.SUCCESS, updatedUser, userMessage.AVATAR_UPDATED));
    }
  )

  updateUserCoverImage = asyncHandler(
    async (req, res) => {
      const coverImageLocalPath = req.file?.buffer;
      const updatedUser = await this.userService
        .updateUserCoverImage(req.user._id, coverImageLocalPath);
      res
        .status(STATUS_CODE.SUCCESS)
        .json(new ApiResponse(STATUS_CODE.SUCCESS, updatedUser, userMessage.COVER_IMG_UPDATED));
    }
  )

  getUserChannelProfile = asyncHandler(
    async (req, res) => {
      const { username } = req.params;
      const channel = await this.userService
        .getUserChannelProfile(username, req.user?._id);
      res
        .status(STATUS_CODE.SUCCESS)
        .json(new ApiResponse(STATUS_CODE.SUCCESS, channel, userMessage.FETCH_CHANNEL));
    });

  getWatchHistory = asyncHandler(
    async (req, res) => {
      const watchHistory = await this.userService
        .getWatchHistory(req.user._id);
      res
        .status(STATUS_CODE.SUCCESS)
        .json(new ApiResponse(STATUS_CODE.SUCCESS, watchHistory, userMessage.FETCH_HISTORY));
    });

}


