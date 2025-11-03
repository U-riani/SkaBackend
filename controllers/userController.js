import User from "../models/User.js";
import asyncHandler from "../middlewares/asyncHandler.js";

/**
 * @desc Register a new user (pending approval)
 * @route POST /api/users
 * @access Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    idNumber,
    password,
    facebookUrl,
    instagramUrl,
  } = req.body;

  if (!firstName || !lastName || !email || !phone || !idNumber || !password) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const imageUrl = req.file?.path || null;

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    idNumber,
    password,
    imageUrl,
    facebookUrl,
    instagramUrl,
    status: "pending", // default
  });

  res.status(201).json({
    success: true,
    message: "Registration submitted. Await admin approval.",
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      status: user.status,
    },
  });
});

/**
 * @desc Admin: Approve / reject / block user
 * @route PATCH /api/users/:id/verify
 * @access Admin only
 */
export const verifyUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "approved", "rejected", or "blocked"

  const validStatuses = ["approved", "rejected", "blocked", "pending"];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // // Prevent re-approving a blocked user (optional safety)
  // if (user.status === "blocked" && status !== "blocked") {
  //   res.status(403);
  //   throw new Error("Cannot modify a blocked user");
  // }

  user.status = status;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User marked as ${status}`,
    user,
  });
});

/**
 * @desc Admin: Get all users by status
 * @route GET /api/users/:status
 * @access Admin only
 */
const getUsersByStatus = (status) =>
  asyncHandler(async (req, res) => {
    const users = await User.find({ status })
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  });

export const getPendingUsers = getUsersByStatus("pending");
export const getApprovedUsers = getUsersByStatus("approved");
export const getRejectedUsers = getUsersByStatus("rejected");
export const getBlockedUsers = getUsersByStatus("blocked");

/**
 * @desc Admin: Get all users
 * @route GET /api/users
 * @access Admin only
 */
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: users.length, users });
});
