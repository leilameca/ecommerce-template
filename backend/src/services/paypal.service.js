const { env } = require("../config/env");

const getBaseUrl = () =>
  env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const getAccessToken = async () => {
  const auth = Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${getBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("Failed to get PayPal access token");
  return data.access_token;
};

const createPaypalOrder = async (amount, currency) => {
  const token = await getAccessToken();
  const res = await fetch(`${getBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: Number(amount).toFixed(2),
          },
        },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to create PayPal order");
  return data;
};

const capturePaypalOrder = async (paypalOrderId) => {
  const token = await getAccessToken();
  const res = await fetch(`${getBaseUrl()}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to capture PayPal order");
  return data;
};

module.exports = { createPaypalOrder, capturePaypalOrder };
