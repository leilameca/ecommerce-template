const Order = require("../models/order.model");
const ApiError = require("../utils/api-error");
const asyncHandler = require("../utils/async-handler");
const { validateObjectId } = require("../utils/validation");
const { createCheckoutSession, constructWebhookEvent } = require("../services/stripe.service");
const { env } = require("../config/env");

const createStripeSession = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  validateObjectId(orderId, "order id");

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found.");
  if (order.paymentStatus === "paid") throw new ApiError(400, "Order already paid.");

  const successUrl = `${env.CLIENT_URL}/checkout/success`;
  const cancelUrl = `${env.CLIENT_URL}/checkout/cancel`;

  const session = await createCheckoutSession({ order, successUrl, cancelUrl });

  res.status(200).json({ success: true, data: { url: session.url } });
});

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = constructWebhookEvent(req.body, sig);
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        orderStatus: "confirmed",
      });
    }
  }

  res.status(200).json({ received: true });
};

module.exports = { createStripeSession, handleWebhook };
