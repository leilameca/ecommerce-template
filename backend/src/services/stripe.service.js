const { env } = require("../config/env");

const getStripe = () => {
  if (!env.STRIPE_SECRET_KEY) return null;
  return require("stripe")(env.STRIPE_SECRET_KEY);
};

const createCheckoutSession = async ({ order, successUrl, cancelUrl }) => {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe is not configured.");

  const lineItems = order.items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  if (order.shipping > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Shipping" },
        unit_amount: Math.round(order.shipping * 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    metadata: { orderId: String(order._id) },
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
    cancel_url: `${cancelUrl}?order_id=${order._id}`,
  });

  return session;
};

const constructWebhookEvent = (rawBody, signature) => {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe is not configured.");
  return stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
};

module.exports = { createCheckoutSession, constructWebhookEvent, getStripe };
