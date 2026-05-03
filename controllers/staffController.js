import asyncHandler from "../middlewares/asyncHandler.js";
import Staff from "../models/Staff.js";
import generateToken from "../utils/generateToken.js";

// 🔹 Login
export const loginStaff = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const staff = await Staff.findOne({ email });

  if (staff && (await staff.matchPassword(password))) {
    const token = generateToken(staff._id, "staff");

    res.json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      token,
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

// 🔹 Create new staff (Admin only)
export const createStaff = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await Staff.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error("Staff already exists");
  }

  const staff = await Staff.create({ name, email, password, role });
  res.status(201).json({
    _id: staff._id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
  });
});

// 🔹 Get staff list (Admin only)
export const getStaffList = asyncHandler(async (req, res) => {
  const staff = await Staff.find().select("-password").sort({ createdAt: -1 });
  res.json({ count: staff.length, staff });
});
