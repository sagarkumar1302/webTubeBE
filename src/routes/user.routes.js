import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateUser,
  updateProfileandCoverImage,
  changePassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImg", maxCount: 1 },
  ]),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(jwtVerify, logoutUser);
router.route("/update-user").put(jwtVerify, updateUser);
router.route("/update-avatar").put(
  jwtVerify,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImg", maxCount: 1 },
  ]),
  updateProfileandCoverImage
);
router.route("/refresh-token").post(jwtVerify, refreshAccessToken);
router.route("/change-password").post(jwtVerify, changePassword);
router.route("/get-user").get(jwtVerify, getCurrentUser);
router.route("/get-channel/:username").get(jwtVerify, getUserChannelProfile);
router.route("/get-watchhistory").get(jwtVerify, getWatchHistory);
export default router;
