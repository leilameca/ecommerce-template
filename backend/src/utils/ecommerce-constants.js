const PAYMENT_METHODS = [
  "whatsapp",
  "cash_on_delivery",
  "transfer",
  "online_payment",
];

const DEFAULT_STORE_PAYMENT_METHODS = ["whatsapp", "cash_on_delivery"];

const PAYMENT_STATUSES = ["pending", "paid", "failed"];

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

module.exports = {
  PAYMENT_METHODS,
  DEFAULT_STORE_PAYMENT_METHODS,
  PAYMENT_STATUSES,
  ORDER_STATUSES,
};
