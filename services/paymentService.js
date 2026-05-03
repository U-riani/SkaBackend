// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const processPayment = async (user, event, method = "stripe") => {
//   if (method !== "stripe") {
//     // handle other methods or free
//     return true;
//   }

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     mode: "payment",
//     customer_email: user.email,

//     line_items: [
//       {
//         price_data: {
//           currency: "gel",
//           product_data: {
//             name: event.title,
//             description: `${event.location} — ${new Date(
//               event.date
//             ).toLocaleDateString()}`, // ✅ Added description
//           },
//           unit_amount: Math.round(event.price * 100), // ✅ safer rounding
//         },
//         quantity: 1,
//       },
//     ],

//     // ✅ Metadata for webhooks or future tracking
//     metadata: {
//       userId: user._id.toString(),
//       eventId: event._id.toString(),
//     },

//     success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
//   });

//   return session;
// };
