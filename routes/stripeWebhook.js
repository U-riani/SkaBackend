// import express from "express";
// import Stripe from "stripe";
// import QRCode from "qrcode";
// import Ticket from "../models/Ticket.js";
// import Event from "../models/Event.js";
// import { sendTicketEmail } from "../services/emailService.js";

// const router = express.Router();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }), // ⛔ Important for Stripe verification
//   async (req, res) => {
//     const sig = req.headers["stripe-signature"];

//     try {
//       const event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET
//       );

//       // 💳 Handle completed payments
//       if (event.type === "checkout.session.completed") {
//         const session = event.data.object;
//         const { userId, eventId } = session.metadata;

//         // Find event
//         const eventDoc = await Event.findById(eventId);
//         if (!eventDoc) throw new Error("Event not found for webhook");

//         // Generate QR
//         const qrData = `TICKET-${eventId}-${userId}-${Date.now()}`;
//         const qrCodeUrl = await QRCode.toDataURL(qrData);

//         // Save ticket
//         const ticket = await Ticket.create({
//           user: userId,
//           event: eventId,
//           qrCodeUrl,
//           qrCodeData: qrData,
//           paymentMethod: "stripe",
//           paymentStatus: "paid",
//         });

//         // Send QR email
//         await sendTicketEmail(
//           { firstName: session.customer_details.name || "Guest", email: session.customer_email },
//           eventDoc,
//           qrCodeUrl
//         );
//       }

//       res.json({ received: true });
//     } catch (err) {
//       console.error("❌ Webhook error:", err.message);
//       res.status(400).send(`Webhook Error: ${err.message}`);
//     }
//   }
// );

// export default router;
