// server\index.js

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import adminAuthRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import inviteRoutes from "./routes/inviteRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://ska-bar.netlify.app",
    "https://admin-ska-bar.netlify.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// ✅ Register raw-body parser BEFORE paymentRoutes
app.use(
  "/api/payments/unipay/callback",
  express.json({ verify: (req, res, buf) => (req.rawBody = buf) }),
);

app.use("/api/users", userRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/staff", staffRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
