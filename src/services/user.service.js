import { User } from "../models/user.model";
export default class UserService {
  generateAccessTokenAndRefreshToken = async (userId) => {
    try {
      const user = await User.findById(userId);
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
    } catch {
      throw new ApiError(
        500,
        "Something went wrong while generating referesh and access token"
      );
    }
  };
}
