import { User } from "../models/user.model";
export default class UserService {

  async init(db){
    this.User=db.models.User
  }

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
        "Something went wrong while generating refresh and access token"
      );
    }
  };

  // ---- Helper: check duplicate user ----
  checkUserExists = async (username, email) => {
    const existedUser = await this.User.findOne({
      $or: [{ username }, { email }],
    });
    return existedUser;
  };
  
  registerUser = async (userData) => {
    const existedUser= await this.checkUserExists(username,email);
    if(existedUser){
      throw new ApiError(400, "User with this username or email already exists");
    }
    // kal comlete karna hai isse
  };
