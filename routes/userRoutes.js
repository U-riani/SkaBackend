import express from "express";
import {
  registerUser,
  getUsers,
  getPendingUsers,
  getApprovedUsers,
  verifyUser,
  getRejectedUsers,
  getBlockedUsers,
} from "../controllers/userController.js";
import { uploadWithLogs } from "../middlewares/uploadMiddleware.js";
import { protectAdmin, adminOnly } from "../middlewares/adminAuthMiddleware.js";

const router = express.Router();

// Public registration route
router.post("/", uploadWithLogs, registerUser);

// Admin-protected routes
router.get("/", protectAdmin, adminOnly, getUsers);
router.get("/pending", protectAdmin, adminOnly, getPendingUsers);
router.get("/approved", protectAdmin, adminOnly, getApprovedUsers);
router.patch("/:id/verify", protectAdmin, adminOnly, verifyUser);
router.get("/rejected", protectAdmin, adminOnly, getRejectedUsers);
router.get("/blocked", protectAdmin, adminOnly, getBlockedUsers);

export default router;
