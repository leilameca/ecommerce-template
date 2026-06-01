const nodemailer = require("nodemailer");
const { env } = require("../config/env");

const isEmailConfigured = () =>
  Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.SMTP_FROM);

const createTransporter = () =>
  nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });

const sendOrderNotification = async (order) => {
  if (!isEmailConfigured()) return;

  const to = env.STORE_NOTIFICATION_EMAIL || env.SMTP_USER;
  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0">${item.name}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:center">${item.quantity}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #f0f0f0;text-align:right">$${item.lineTotal.toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#18181b">
      <h2 style="font-size:20px;font-weight:600;margin-bottom:4px">New order received</h2>
      <p style="color:#71717a;font-size:13px;margin-top:0">Order <strong>#${order._id}</strong></p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px">
        <thead>
          <tr style="background:#f4f4f5">
            <th style="padding:8px;text-align:left">Product</th>
            <th style="padding:8px;text-align:center">Qty</th>
            <th style="padding:8px;text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <table style="width:100%;font-size:14px;margin-bottom:20px">
        <tr><td>Subtotal</td><td style="text-align:right">$${order.subtotal.toFixed(2)}</td></tr>
        <tr><td>Shipping</td><td style="text-align:right">$${order.shipping.toFixed(2)}</td></tr>
        <tr style="font-weight:600"><td>Total</td><td style="text-align:right">$${order.total.toFixed(2)}</td></tr>
      </table>

      <table style="width:100%;font-size:14px;background:#f4f4f5;padding:12px;border-radius:8px">
        <tr><td style="color:#71717a">Customer</td><td>${order.customerName}</td></tr>
        <tr><td style="color:#71717a">Phone</td><td>${order.phone}</td></tr>
        <tr><td style="color:#71717a">Address</td><td>${order.address}</td></tr>
        <tr><td style="color:#71717a">Payment</td><td>${order.paymentMethod}</td></tr>
        ${order.notes ? `<tr><td style="color:#71717a">Notes</td><td>${order.notes}</td></tr>` : ""}
      </table>
    </div>
  `;

  try {
    await createTransporter().sendMail({
      from: env.SMTP_FROM,
      to,
      subject: `New order #${order._id} — ${order.customerName}`,
      html,
    });
  } catch (error) {
    console.error("[email] Failed to send order notification:", error.message);
  }
};

module.exports = { sendOrderNotification };
