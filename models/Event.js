import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  bannerUrl: { type: String },
  location: { type: String },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["active", "archived"],
    default: "active",
  },
  capacity: { type: Number, default: 250 },
});

export default mongoose.model("Event", eventSchema);
