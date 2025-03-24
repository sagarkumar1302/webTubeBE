import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});
const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) {
      console.error("Local path is undefined or null");
      return null;
    }

    if (!fs.existsSync(localPath)) {
      console.error("File does not exist at path:", localPath);
      return null;
    }

    console.log("Uploading file to Cloudinary. Local Path:", localPath);

    // Upload file to Cloudinary
    const res = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto", // Automatically detect file type
    });

    console.log("Cloudinary Upload Response:", res);

    // File uploaded successfully
    console.log("Upload successful. File URL:", res.url);

    // Remove the file from local storage after successful upload
    fs.unlinkSync(localPath);
    // console.log(res);
    
    return res;
  } catch (error) {
    console.error("Error during Cloudinary upload:", error);

    // Attempt to remove the file from local storage if it exists
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }

    return null;
  }
};
export { uploadOnCloudinary };
