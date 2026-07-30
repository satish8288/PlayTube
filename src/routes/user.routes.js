import express from "express";
import {
  userRegister,
  loginUser,
  logoutUser,
  getCurrentUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import {registerUserSchema,
  loginUserSchema,
  changeCurrentPasswordSchema,
  updateAccountDetailsSchema
} from "../schemaValidations/user.validation.js"
import {validate} from "../middlewares/validate.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/imageUpload.middleware.js";
const router = express.Router();

router.route("/register").post(
  uploadImage.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  userRegister
);

router.post(
  "/login",
  verifyJWT,
  loginUser
);

router.post(
  "/logout",
  verifyJWT,
  logoutUser
);

router.get(
  "/current-user",
  verifyJWT,
  getCurrentUser
)

router.get(
  "/refresh-token",
  refreshAccessToken
);

router.get(
  "/change-password",
  verifyJWT,
  changeCurrentPassword
);

router.post(
    "/update-account",
    verifyJWT,
    updateAccountDetails
  );

router.post(
    "/update-avatar",
    verifyJWT,
    uploadImage.single("avatar"),
    updateUserAvatar
  );

router.post(
    "/update-coverImage",
    verifyJWT,
    uploadImage.single("coverImage"),
    updateUserCoverImage
  );

router.get(
  "/c/:username",
  verifyJWT,
  getUserChannelProfile
);

router.get(
  "/history",
  verifyJWT,
  getWatchHistory);

export default router;
