import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateUser,
  updateProfileandCoverImage,
  changePassword,
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
router.route("/update-user").post(jwtVerify, updateUser);
router.route("/update-avatar").post(jwtVerify,upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImg", maxCount: 1 },
]), updateProfileandCoverImage);
router.route("/refresh-token").post(jwtVerify, refreshAccessToken);
router.route("/change-password").post(jwtVerify, changePassword);
export default router;
