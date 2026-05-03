// services/paymentService.unipay.js

export const createUniPayPayment = async (user, event) => {
  const merchantId = process.env.UNIPAY_MERCHANT_ID;
  const apiKey    = process.env.UNIPAY_API_KEY;    // or secret

  const requestBody = {
    MerchantID: merchantId,
    OrderID: `ORD-${event._id}-${user._id}-${Date.now()}`,
    OrderPrice: event.price,
    OrderCurrency: "GEL",
    OrderName: event.title,
    Items: [
      {
        price: event.price,
        quantity: 1,
        title: event.title,
        description: event.description || "",
        currency: "GEL",      }
    ],
    CallbackURL: `${process.env.BACKEND_URL}/api/payments/unipay/callback`,
    SuccessURL: `${process.env.FRONTEND_URL}/payment-success`,
    FailURL: `${process.env.FRONTEND_URL}/payment-cancel`
  };

  const response = await fetch("https://api.unipay.com/v2/payments/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "UniPAY payment creation failed");
  }

  return data.payment_url || data.checkoutUrl;
};
