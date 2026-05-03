// routes/ticketRoutes.js
import express from "express";
import {
  buyTicket,
  getMyTickets,
  validateTicket,
} from "../controllers/ticketController.js";
import { protectUser } from "../middlewares/userAuthMiddleware.js";
import { protectStaff } from "../middlewares/staffAuthMiddleware.js";

const router = express.Router();

router.post("/buy", protectUser, buyTicket);
router.get("/my", protectUser, getMyTickets);
router.post("/validate", protectStaff, validateTicket);

export default router;
