import express from "express";
import { validateRequest } from "../middlewares/validateRequest.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../middlewares/imageUpload.middleware.js";
import { validateFiles } from "../middlewares/validateFiles.middleware.js"
import { UserRepository } from "../repository/user.repository.js";
import { UserService } from "../services/user.service.js";
import { UserController } from "../controllers/user.controller.js";
import {
  registerUserSchema,
  loginUserSchema,
  changeCurrentPasswordSchema,
  updateAccountDetailsSchema
} from "../schemaValidations/user.validation.js"

const router = express.Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post("/register",
  uploadImage.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  validateFiles("avatar"),
  validateRequest(registerUserSchema),
  userController.userRegister
);

router.post(
  "/login",
  validateRequest(loginUserSchema),
  userController.loginUser
);

router.post(
  "/logout",
  verifyJWT,
  userController.logoutUser
);

router.get(
  "/current-user",
  verifyJWT,
  userController.getCurrentUser
)

router.post(
  "/refresh-token",
  userController.refreshAccessToken
);

router.post(
  "/change-password",
  verifyJWT,
  validateRequest(changeCurrentPasswordSchema),
  userController.changeCurrentPassword
);

router.patch(
  "/update-account",
  verifyJWT,
  validateRequest(updateAccountDetailsSchema),
  userController.updateAccountDetails
);

router.patch(
  "/update-avatar",
  verifyJWT,
  uploadImage.single("avatar"),
  validateFiles("avatar"),
  userController.updateUserAvatar
);

router.patch(
  "/update-coverImage",
  verifyJWT,
  uploadImage.single("coverImage"),
  validateFiles("coverImage"),
  userController.updateUserCoverImage
);

router.get(
  "/c/:username",
  verifyJWT,
  userController.getUserChannelProfile
);

router.get(
  "/history",
  verifyJWT,
  userController.getWatchHistory);

export default router;
