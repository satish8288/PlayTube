import streamifier from "streamifier";
import fs from "fs";
import { cloudinary } from "../config/cloudinary.js";
import { ApiError } from "./ApiError.js";
import { logger } from "./logger.js";

const cleanupLocalFile = (localFilePath) => {
  if (localFilePath && fs.existsSync(localFilePath)) {
    fs.unlinkSync(localFilePath);
  }
};

const uploadBufferOnCloudinary = (fileBuffer, folderName, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) return resolve(null);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder: `playtube/${folderName}`,
      },
      (error, response) => {
        if (error) {
          logger.error("Cloudinary stream upload error:", error);
          return reject(new ApiError(500, "File upload to cloud storage failed"));
        }
        resolve({
          url: response.secure_url,
          publicId: response.public_id,
        });
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

const uploadOnCloudinary = async (localFilePath, folderName, resourceType = "auto") => {
  if (!localFilePath) return null;

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
      folder: `playtube/${folderName}`,
    });

    return {
      url: response.secure_url,
      publicId: response.public_id,
      ...(response.resource_type === "video" && { duration: response.duration }),
    };
  } catch (error) {
    logger.error("Cloudinary upload error:", error?.message || error);
    throw new ApiError(500, "File upload to cloud storage failed");
  } finally {
    cleanupLocalFile(localFilePath);
  }
};

const destroyFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) return null;

  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (response.result !== "ok" && response.result !== "not found") {
      logger.warn(`Cloudinary deletion issue (${publicId}): ${response.result}`);
    }

    logger.info(`File ${publicId} deleted from cloudinary successfully`);
    return response;
  } catch (error) {
    logger.error(`Cloudinary deletion error (${publicId}): ${error?.message || error}`, {
      stack: error.stack,
    });
    return null;
  }
};

export {
  uploadOnCloudinary,
  uploadBufferOnCloudinary,
  destroyFromCloudinary
};
