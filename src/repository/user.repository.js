import mongoose from "mongoose";
import { User } from "../models/user.model.js";

export class UserRepository {
  async findByUsernameOrEmail(username, email) {
    return User.findOne({ $or: [{ username }, { email }] });
  }

  async createUser(payload) {
    const user = await User.create(payload)
    return User.findById(user._id)
  }

  async findById(userId) {
    return User.findById(userId);
  }

  async findByIdSafe(userId) {
    return User.findById(userId).select("-password -refreshToken");
  }

  async findByIdWithPassword(userId) {
    return User.findById(userId).select("+password");
  }

  async saveUser(userDoc) {
    return userDoc.save({ validateBeforeSave: false });
  }

  async clearRefreshToken(userId) {
    return User.findByIdAndUpdate(
      userId,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );
  }

  async updateUser(userId, updateData) {
    return User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");
  }

  async updateAvatar(userId, { url, publicId }) {
    return User.findByIdAndUpdate(
      userId,
      { $set: { avatar: { url, publicId } } },
      { returnDocument: "after" }
    ).select("-password -refreshToken");
  }

  getUserChannelProfile(username, currentUserId) {
    return User.aggregate([
      {
        $match: { username: username.trim() },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      {
        $addFields: {
          subscribersCount: { $size: "$subscribers" },
          channelsSubscribedToCount: { $size: "$subscribedTo" },
          isSubscribed: {
            $cond: {
              if: {
                $in: [
                  currentUserId ? new mongoose.Types.ObjectId(currentUserId) : null,
                  "$subscribers.subscriber",
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          fullName: 1,
          username: 1,
          subscribersCount: 1,
          channelsSubscribedToCount: 1,
          isSubscribed: 1,
          avatar: 1,
          coverImage: 1,
          email: 1,
        },
      },
    ]);
  }

  getWatchHistory(userId) {
    return User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  { $project: { fullName: 1, username: 1, avatar: 1 } },
                ],
              },
            },
            {
              $addFields: { owner: { $first: "$owner" } },
            },
          ],
        },
      },
    ]);
  }
}