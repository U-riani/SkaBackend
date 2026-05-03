import express from "express";
import {
  loginStaff,
  createStaff,
  getStaffList,
} from "../controllers/staffController.js";
import { protectAdmin } from "../middlewares/adminAuthMiddleware.js"; // reuse existing


const router = express.Router();

router.post("/login", loginStaff);
router.post("/create", protectAdmin, createStaff);
router.get("/", protectAdmin, getStaffList);

export default router;
