import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log(user);
    
    const accessToken = user.generateAccessToken();
    console.log(accessToken);
    const refreshToken = user.generateRefreshToken();
    console.log(refreshToken);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error.message || "Something went wrong while generating tokens");
  }
};
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;
  //   if(!fullname || !username || !email || !password){
  //     res.status(400);
  //     throw new ApiError(400, "Please fill all the fields");
  //   }
  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    res.status(400);
    throw new ApiError(400, "Please fill all the fields");
  }
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }
  //   const avatarLocalPath = req.files?.avatar[0]?.path;
  // const avatarLocalPath = req.files["avatar"][0].path;
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImgLocalPath = req.files?.coverImg?.[0]?.path;
  //   const coverImgLocalPath = req.files["coverImg"][0].path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Please upload avatar image");
  }
  console.log(avatarLocalPath);

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImg = await uploadOnCloudinary(coverImgLocalPath);
  if (!avatar) {
    throw new ApiError(
      500,
      "Something went wrong while uploading avatar image"
    );
  }
  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImg: coverImg?.url || "",
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "User not created");
  }
  // console.log(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  // if ([email, username, password].some((field) => field?.trim() === "")) {
  //   throw new ApiError(400, "Please fill all the fields");
  // }
  if (!email && !username) {
    throw new ApiError(400, "Please provide email or username");
  }
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordValid = await user.verifyPassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true, //cookie cannot be accessed or modified by the browser(Front End). It can only modified by the server(Back End).
    secure: true, //cookie will only be sent over HTTPS
  };
  return (
    res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      // .cookie("user", loggedInUser, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      )
  );
});
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {$set: { refreshToken: "" }, }, { new: true });
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(400, "Refresh token is required");
  }
  try {
    const decode = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decode?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (user?.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refesh token is expired");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);
    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken : newRefreshToken
      }, "Access token refreshed successfully"));
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
});
  
export { registerUser, loginUser, logoutUser, refreshAccessToken };
