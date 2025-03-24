import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const jwtVerify = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            res.status(401);
            throw new ApiError(401, "Unauthorized Request");
        }
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decode?._id).select("-password -refreshToken");
        if (!user) {
            res.status(401);
            throw new ApiError(401, "Invalid Access Token");
        }
        req.user = user; // We can use this user in the next middleware
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});