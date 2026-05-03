import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    qrCodeUrl: { type: String, required: true },
    qrCodeData: { type: String, required: true }, // used for scanning validation
    guest: {
      firstName: { type: String },
      lastName: { type: String },
      facebookUrl: { type: String },
      instagramUrl: { type: String },
    },
    used: { type: Boolean, default: false },
    usedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Invite", inviteSchema);
