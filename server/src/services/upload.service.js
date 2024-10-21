import { v2 as cloudinary } from "cloudinary";
import env from "../utils/validateEnv.js";

export const uploadSingleImage = async (image) => {
  try {
    const result = await cloudinary.uploader.upload(image, {
      upload_preset: env.CLOUDINARY_UPLOAD_PRESET,
    });
    return result.secure_url;
  } catch (error) {
    console.error(error);
  }
};