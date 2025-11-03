import asyncHandler from "../middlewares/asyncHandler.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

// Generate token helper
const generateAdminToken = (res, adminId) => {
  const token = jwt.sign({ adminId }, process.env.JWT_SECRET, { expiresIn: "30d" });
  res.cookie("jwt_admin", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  return token;
};

// Register new admin/ticketChecker
export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  const admin = await Admin.create({ name, email, password, role });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid admin data");
  }
});

// Login
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (admin && (await admin.matchPassword(password))) {
    const token = generateAdminToken(res, admin._id);
    console.log("Generated JWT Token for admin:", token);
    res.json({
      _id: admin._id,
      name: admin.name,
      role: admin.role,
      token, // 👈 add this line
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});



// Logout
export const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie("jwt_admin", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Admin logged out successfully" });
});

// Profile
export const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select("-password");
  res.json(admin);
});
