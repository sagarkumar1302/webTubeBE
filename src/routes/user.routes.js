import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
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
router.route("/refresh-token").post(jwtVerify, refreshAccessToken);
export default router;
