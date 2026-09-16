import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

const db = {
  models: {
    User,
    Video,
  },
};

export default db;