// routes/adminRoutes.js
import express from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
} from "../controllers/adminController.js";

import {
  protectAdmin,
  adminOnly,
  ticketCheckerOnly,
} from "../middlewares/adminAuthMiddleware.js";

const router = express.Router();

/**
 * ⚠️ TEMPORARY: keep register open for first admin creation.
 * Once your first admin exists, remove or comment this line!
 */
router.post("/register", registerAdmin);

// Public login route
router.post("/login", loginAdmin);

// Private routes
router.post("/logout", protectAdmin, logoutAdmin);
router.get("/profile", protectAdmin, adminOnly, getAdminProfile);

export default router;
