// models/Ticket.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    qrCodeUrl: { type: String, required: true },
    qrCodeData: { type: String, required: true }, // used for validation
    purchaseDate: { type: Date, default: Date.now },
    used: { type: Boolean, default: false },
    usedAt: { type: Date },
    paymentMethod: {
      type: String,
      enum: ["unipay", "tbc", "stripe", "free"],
      default: "unipay",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

ticketSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model("Ticket", ticketSchema);
