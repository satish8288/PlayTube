import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorization token");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE);

    if (!decodedToken) {
      throw new ApiError(401, "Unauthorization token");
    }

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    res.user = user;

    next();
  } catch (error) {
    console.log("error in auth middleware :", error);
    throw new ApiError(error?.message || "Invalid access token");
  }
});

export { verifyJWT };
