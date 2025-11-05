import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { protectAdmin, adminOnly } from "../middlewares/adminAuthMiddleware.js";
import { uploadWithLogs } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Admin routes
router.post("/", protectAdmin, adminOnly, uploadWithLogs, createEvent);
router.put("/:id", protectAdmin, adminOnly, uploadWithLogs, updateEvent);
router.delete("/:id", protectAdmin, adminOnly, deleteEvent);

export default router;
