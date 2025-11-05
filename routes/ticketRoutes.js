// routes/ticketRoutes.js
import express from "express";
import {
  buyTicket,
  getMyTickets,
  validateTicket,
} from "../controllers/ticketController.js";
import { protectUser } from "../middlewares/userAuthMiddleware.js";
import { protectAdmin } from "../middlewares/adminAuthMiddleware.js";

const router = express.Router();

router.post("/buy", protectUser, buyTicket);
router.get("/my", protectUser, getMyTickets);
router.post("/validate", protectAdmin, validateTicket);

export default router;
