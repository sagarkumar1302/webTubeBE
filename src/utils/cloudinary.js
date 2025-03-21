import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});
const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) return null;
    //Upload file on cloudinary
    const res = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });
    //File uploaded successfully
    console.log("Upload successful", res.url);
    return res;
  } catch (error) {
    fs.unlinkSync(localPath); //Remove file from local storage
    console.error(error);
    return null;
  }
};
export { uploadOnCloudinary };
