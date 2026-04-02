export function buildWhatsappCheckoutUrl({ phoneNumber, message }) {
  const normalizedPhone = String(phoneNumber || "").replace(/[^\d]/g, "");

  if (!normalizedPhone) {
    return "";
  }

  const encodedMessage = encodeURIComponent(message || "");

  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
}
