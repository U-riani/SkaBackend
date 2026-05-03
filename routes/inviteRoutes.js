import express from "express";
import {
  createInvite,
  validateInvite,
  getInvitesByEvent,
} from "../controllers/inviteController.js";
import { protectAdmin } from "../middlewares/adminAuthMiddleware.js";

const router = express.Router();

router.post("/create", protectAdmin, createInvite);
router.post("/validate", protectAdmin, validateInvite);
router.get("/event/:eventId", protectAdmin, getInvitesByEvent);

export default router;
