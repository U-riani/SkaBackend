// // services/paymentService.tbc.js
// export const createTbcPayment = async (user, event) => {
//   const requestBody = {
//     amount: event.price,
//     currency: "GEL",
//     client_ip_addr: "127.0.0.1",
//     description: `Ticket for ${event.title}`,
//     language: "EN",
//     callback_url: `${process.env.BACKEND_URL}/api/payments/tbc/callback`,
//     success_url: `${process.env.FRONTEND_URL}/payment-success`,
//     fail_url: `${process.env.FRONTEND_URL}/payment-cancel`,
//   };

//   const authHeader =
//     "Basic " +
//     Buffer.from(
//       `${process.env.TBC_CLIENT_ID}:${process.env.TBC_CLIENT_SECRET}`
//     ).toString("base64");

//   const response = await fetch(
//     "https://ecommerce.tbcbank.ge/payment/rest/register.do",
//     {
//       method: "POST",
//       headers: {
//         Authorization: authHeader,
//         "Content-Type": "application/x-www-form-urlencoded", // or "application/json" if their API accepts
//       },
//       body: new URLSearchParams(requestBody),
//     }
//   );

  
// const text = await response.text();
// if (text.startsWith("<")) {
//   console.error("TBC returned HTML:", text);
//   throw new Error("Invalid TBC response, check credentials or endpoint.");
// }

//   const data = await response.json();

//   if (data.errorCode) {
//     throw new Error(data.errorMessage);
//   }

//   return data.formUrl; // redirect user here
// };
