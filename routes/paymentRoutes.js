import express from "express";
import { unipayCallback } from "../controllers/paymentController.js";
const router = express.Router();

router.post("/unipay/callback", unipayCallback);

export default router;
