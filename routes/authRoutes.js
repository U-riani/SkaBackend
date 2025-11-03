import express from "express";
import {
  loginUser,
  logoutUser,
  getUserProfile,
} from "../controllers/authController.js";
import { protectUser } from "../middlewares/userAuthMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", protectUser, logoutUser);
router.get("/profile", protectUser, getUserProfile);

export default router;
