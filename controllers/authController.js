import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

/**
 * Helper to generate JWT token
 */
const generateUserToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });

  res.cookie("jwt_user", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

/**
 * @desc Login user
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateUserToken(res, user._id);

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      imageUrl: user.imageUrl,
      status: user.status, // new
      token,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});


/**
 * @desc Logout user
 * @route POST /api/auth/logout
 * @access Private
 */
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt_user", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: "User logged out successfully" });
});

/**
 * @desc Get current user profile
 * @route GET /api/auth/profile
 * @access Private
 */

// ✅ Profile route
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});


