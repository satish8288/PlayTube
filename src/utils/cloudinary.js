import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folderName) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: `playtube/${folderName}`,
    });

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return {
      url: response.secure_url,
      publicId: response.public_id,
      duration: response.duration,
    };
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    console.log("Error in unlinked localStorage file :", error);
  }
};

// destroy file from cloudinary
const destroyFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) {
    throw new ApiError(400, "Public ID is required");
  }

  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (response.result === "ok" || response.result === "not found") {
      return response;
    }

    throw new ApiError(500, `Cloudinary delete failed: ${response.result}`);
  } catch (error) {
    console.error("Error in destroying file from Cloudinary:", error);
    throw error;
  }
};
export { uploadOnCloudinary, destroyFromCloudinary };
