import { User } from "../models/user.model";
import { Video } from "../models/video.model";

const db = {
  models: {
    User,
    Video,
  },    
};  

export default db;