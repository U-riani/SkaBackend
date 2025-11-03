import asyncHandler from "../middlewares/asyncHandler.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

/**
 * Generate JWT and set cookie + return it for frontend use
 */
const generateAdminToken = (res, adminId) => {
  const token = jwt.sign({ adminId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Store in secure cookie (for API calls that use credentials)
  res.cookie("jwt_admin", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  // Also return it to client for localStorage
  return token;
};

/**
 * Register admin (used only for first-time setup)
 */
export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  const admin = await Admin.create({ name, email, password, role });

  if (!admin) {
    res.status(400);
    throw new Error("Invalid admin data");
  }

  // Generate token immediately on registration (optional)
  const token = generateAdminToken(res, admin._id);

  res.status(201).json({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    token, // important for frontend storage
  });
});

/**
 * Login admin
 */
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    const token = generateAdminToken(res, admin._id);
    console.log("Generated JWT Token for admin:", token);

    res.status(200).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token, // return token for localStorage
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

/**
 * Logout admin (clears cookie)
 */
export const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie("jwt_admin", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Admin logged out successfully" });
});

/**
 * Get logged-in admin profile
 */
export const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select("-password");
  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }
  res.status(200).json(admin);
});
