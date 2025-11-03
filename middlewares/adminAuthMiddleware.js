import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import Admin from "../models/Admin.js";

// Protect route: verify JWT from header or cookie
export const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;

  // 1️⃣ Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2️⃣ Fallback: check cookie (for cases where frontend sends credentials only)
  if (!token && req.cookies.jwt_admin) {
    token = req.cookies.jwt_admin;
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.adminId).select("-password");
    if (!req.admin) {
      res.status(401);
      throw new Error("Admin not found");
    }
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    res.status(401);
    throw new Error("Not authorized, invalid token");
  }
});

// Role restriction
export const adminOnly = (req, res, next) => {
  if (req.admin && req.admin.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied: Admins only");
  }
};

export const ticketCheckerOnly = (req, res, next) => {
  if (req.admin && (req.admin.role === "ticketChecker" || req.admin.role === "admin"))
    next();
  else {
    res.status(403);
    throw new Error("Access denied, ticketChecker only");
  }
};
