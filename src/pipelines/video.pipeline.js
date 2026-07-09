import mongoose from "mongoose";

export const getVideoByIdPipeline = (videoId, userId) => [
  {
    $match: {
      _id: new mongoose.Types.ObjectId(videoId),
    },
  },
  //lookup to get owner details
  {
    $lookup: {
      from: "users",
      localField: "owner",
      foreignField: "_id",
      as: "ownerDetails",
      pipeline: [
        {
          $project: {
            username: 1,
            fullName: 1,
            avatar: 1,
          },
        },
      ],
    },
  },

  // remove the ownerDetails array
  {
    $addFields: {
      owner: {
        $first: "$ownerDetails",
      },
    },
  },
  {
    $unset: "ownerDetails",
  },
  {
    $project: {
      __v: 0,
    },
  },

  // Video.owner           = userId
  // Subscription.channel  = userId
  // optimized version of the below code
  {
    $lookup: {
      from: "subscriptions",

      let: {
        ownerId: "$owner._id",
      },

      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$channel", "$$ownerId"],
            },
          },
        },
      ],
      as: "subscribers",
    },
  },

  //add subscribersCount and isSubscribed fields to the owner object
  {
    $addFields: {
      owner: {
        //merge the owner object with the new fields
        $mergeObjects: [
          "$owner",
          {
            subscribersCount: {
              $size: "$subscribers",
            },
            isSubscribed: {
              $in: [userId, "$subscribers.subscriber"],
            },
          },
        ],
      },
    },
  },

  //remove suscribers fields
  {
    $unset: ["subscribers"],
  },

  //likes count
  {
    $lookup: {
      from: "likes",
      localField: "_id",
      foreignField: "video",
      as: "likes",
    },
  },
  {
    $addFields: {
      likesCount: {
        $size: "$likes",
      },
      isLiked: {
        $in: [userId, "$likes.likedBy"],
      },
    },
  },

  {
    $unset: ["likes"],
  },

  // comments count
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "video",
      as: "comments",
    },
  },
  {
    $addFields: {
      commentsCount: {
        $size: "$comments",
      },
    },
  },
  {
    $unset: ["comments"],
  },
];
