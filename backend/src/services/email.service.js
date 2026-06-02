const { env } = require("../config/env");

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const getSenderEmail = () => env.SMTP_FROM || env.STORE_NOTIFICATION_EMAIL || env.SMTP_USER;

const isEmailConfigured = () => Boolean(env.BREVO_API_KEY && getSenderEmail());

const sendEmail = async ({ to, subject, html, replyTo }) => {
  if (!isEmailConfigured()) {
    console.error("[email] Not configured — set BREVO_API_KEY and SMTP_FROM in environment variables");
    return;
  }

  const senderEmail = getSenderEmail();
  console.log(`[email] Sending "${subject}" to ${to} via Brevo API`);

  const body = {
    sender: { email: senderEmail },
    to: [{ email: to }],
    subject,
    htmlContent: html,
  };

  if (replyTo) body.replyTo = { email: replyTo };

  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error("[email] Brevo API error:", JSON.stringify(error));
      return;
    }

    console.log(`[email] Sent successfully to ${to}`);
  } catch (error) {
    console.error("[email] Failed to send email:", error.message);
  }
};

const sendOrderNotification = async (order) => {
  if (!isEmailConfigured()) return;

  const to = env.STORE_NOTIFICATION_EMAIL || getSenderEmail();
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
        <thead><tr style="background:#f4f4f5">
          <th style="padding:8px;text-align:left">Product</th>
          <th style="padding:8px;text-align:center">Qty</th>
          <th style="padding:8px;text-align:right">Total</th>
        </tr></thead>
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

  await sendEmail({ to, subject: `New order #${order._id} — ${order.customerName}`, html });
};

const sendCustomerOrderConfirmation = async (order) => {
  if (!isEmailConfigured() || !order.customerEmail) return;

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
      <h2 style="font-size:20px;font-weight:600;margin-bottom:4px">Order confirmed</h2>
      <p style="color:#71717a;font-size:13px;margin-top:0">
        Hi ${order.customerName}, your order <strong>#${order._id}</strong> has been received.
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px">
        <thead><tr style="background:#f4f4f5">
          <th style="padding:8px;text-align:left">Product</th>
          <th style="padding:8px;text-align:center">Qty</th>
          <th style="padding:8px;text-align:right">Total</th>
        </tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <table style="width:100%;font-size:14px;margin-bottom:20px">
        <tr><td>Subtotal</td><td style="text-align:right">$${order.subtotal.toFixed(2)}</td></tr>
        <tr><td>Shipping</td><td style="text-align:right">$${order.shipping.toFixed(2)}</td></tr>
        ${order.discountAmount > 0 ? `<tr><td>Discount</td><td style="text-align:right">-$${order.discountAmount.toFixed(2)}</td></tr>` : ""}
        <tr style="font-weight:600"><td>Total</td><td style="text-align:right">$${order.total.toFixed(2)}</td></tr>
      </table>
      <p style="font-size:13px;color:#71717a">Payment: ${order.paymentMethod} · Address: ${order.address}</p>
    </div>
  `;

  await sendEmail({ to: order.customerEmail, subject: `Order confirmed #${order._id}`, html });
};

const sendPasswordResetEmail = async ({ email, name, resetUrl }) => {
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#18181b">
      <h2 style="font-size:20px;font-weight:600;margin-bottom:4px">Reset your password</h2>
      <p style="color:#71717a;font-size:14px">Hi ${name}, click the button below to reset your password. This link expires in 1 hour.</p>
      <a href="${resetUrl}" style="display:inline-block;margin:20px 0;background:#111;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:500">Reset password</a>
      <p style="font-size:12px;color:#a1a1aa">If you did not request this, ignore this email.</p>
    </div>
  `;

  await sendEmail({ to: email, subject: "Reset your password", html });
};

const sendContactMessage = async ({ name, email, message }) => {
  const to = env.STORE_NOTIFICATION_EMAIL || getSenderEmail();
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#18181b">
      <h2 style="font-size:20px;font-weight:600;margin-bottom:4px">New contact message</h2>
      <p style="color:#71717a;font-size:13px;margin-top:0">From: <strong>${name}</strong> &lt;${email}&gt;</p>
      <div style="background:#f4f4f5;padding:16px;border-radius:8px;font-size:14px;line-height:1.6;white-space:pre-wrap">${message}</div>
    </div>
  `;

  await sendEmail({ to, subject: `Contact message from ${name}`, html, replyTo: email });
};

module.exports = { sendOrderNotification, sendCustomerOrderConfirmation, sendPasswordResetEmail, sendContactMessage };
