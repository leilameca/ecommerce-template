import { useRef, useState } from "react";

import Button from "../ui/Button";
import TextInput from "../ui/TextInput";
import TextareaField from "../ui/TextareaField";
import { formatCurrency } from "../../lib/format-currency";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("es", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const shortId = (id) => String(id || "").slice(-8).toUpperCase();

const buildInvoiceHtml = ({ order, businessName, invoiceNote, logoUrl, currency }) => {
  const items = order.items || [];
  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td>${item.name || ""}${
          item.variantSelections && Object.keys(item.variantSelections).length > 0
            ? `<br><span style="font-size:11px;color:#888;">${Object.entries(item.variantSelections)
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ")}</span>`
            : ""
        }</td>
        <td style="text-align:center;">${item.quantity}</td>
        <td style="text-align:right;">${formatCurrency(item.price, currency)}</td>
        <td style="text-align:right;">${formatCurrency(item.lineTotal, currency)}</td>
      </tr>`
    )
    .join("");

  const discountRow =
    order.discountAmount > 0
      ? `<tr><td colspan="3" style="text-align:right;padding-top:4px;">Descuento${order.couponCode ? ` (${order.couponCode})` : ""}:</td><td style="text-align:right;color:#e11d48;">-${formatCurrency(order.discountAmount, currency)}</td></tr>`
      : "";

  const shippingRow =
    order.shipping > 0
      ? `<tr><td colspan="3" style="text-align:right;padding-top:4px;">Envío:</td><td style="text-align:right;">${formatCurrency(order.shipping, currency)}</td></tr>`
      : "";

  const noteBlock = invoiceNote
    ? `<div style="margin-top:32px;padding:16px;border:1px solid #e5e7eb;background:#f9fafb;border-radius:6px;">
        <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;color:#9ca3af;margin-bottom:6px;">Nota</div>
        <p style="margin:0;font-size:13px;color:#374151;white-space:pre-wrap;">${invoiceNote}</p>
      </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<title>Factura #${shortId(order._id)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; color: #111; background: #fff; padding: 48px; max-width: 740px; margin: 0 auto; }
  @media print {
    body { padding: 24px; }
  }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .header-left { display: flex; align-items: center; gap: 16px; }
  .logo { max-height: 52px; max-width: 140px; object-fit: contain; }
  .store-name { font-size: 18px; font-weight: 700; letter-spacing: -0.02em; color: #111; }
  .invoice-label { font-size: 28px; font-weight: 700; letter-spacing: -0.03em; color: #111; }
  .invoice-meta { margin-top: 4px; font-size: 12px; color: #6b7280; }
  .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
  .section-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; color: #9ca3af; margin-bottom: 8px; }
  .bill-to p { font-size: 13px; color: #374151; line-height: 1.7; }
  .bill-to strong { color: #111; font-size: 15px; }
  table { width: 100%; border-collapse: collapse; margin-top: 24px; }
  thead tr { border-bottom: 2px solid #111; }
  thead th { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.18em; color: #6b7280; padding: 8px 4px; }
  thead th:first-child { text-align: left; }
  thead th:last-child, thead th:nth-child(2), thead th:nth-child(3) { text-align: right; }
  thead th:nth-child(2) { text-align: center; }
  tbody tr { border-bottom: 1px solid #f3f4f6; }
  tbody td { font-size: 13px; color: #374151; padding: 10px 4px; vertical-align: top; }
  .totals-table { width: 280px; margin-left: auto; margin-top: 16px; }
  .totals-table td { font-size: 13px; padding: 4px 4px; }
  .total-row td { font-size: 15px; font-weight: 700; border-top: 2px solid #111; padding-top: 10px; }
  .footer { margin-top: 48px; font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 16px; }
</style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      ${logoUrl ? `<img src="${logoUrl}" alt="Logo" class="logo" />` : ""}
      <div class="store-name">${businessName}</div>
    </div>
    <div style="text-align:right;">
      <div class="invoice-label">Factura</div>
      <div class="invoice-meta">#${shortId(order._id)}</div>
      <div class="invoice-meta">${formatDate(order.createdAt)}</div>
    </div>
  </div>

  <hr class="divider" />

  <div class="bill-to">
    <div class="section-label">Facturado a</div>
    <p>
      <strong>${order.customerName || ""}</strong><br/>
      ${order.phone ? `Tel: ${order.phone}<br/>` : ""}
      ${order.address ? `${order.address}` : ""}
      ${order.notes ? `<br/><em style="color:#9ca3af;">${order.notes}</em>` : ""}
    </p>
  </div>

  <table>
    <thead>
      <tr>
        <th style="text-align:left;">Producto</th>
        <th style="text-align:center;">Cant.</th>
        <th style="text-align:right;">Precio unit.</th>
        <th style="text-align:right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <table class="totals-table">
    <tbody>
      <tr>
        <td style="color:#6b7280;">Subtotal:</td>
        <td style="text-align:right;">${formatCurrency(order.subtotal, currency)}</td>
      </tr>
      ${discountRow}
      ${shippingRow}
    </tbody>
    <tbody>
      <tr class="total-row">
        <td>Total:</td>
        <td style="text-align:right;">${formatCurrency(order.total, currency)}</td>
      </tr>
    </tbody>
  </table>

  ${noteBlock}

  <div class="footer">${businessName} · Factura generada el ${formatDate(new Date().toISOString())}</div>
</body>
</html>`;
};

export default function InvoiceModal({ order, storeConfig, onClose }) {
  const [businessName, setBusinessName] = useState(storeConfig?.storeName || "");
  const [invoiceNote, setInvoiceNote] = useState("");
  const previewRef = useRef(null);

  const currency = storeConfig?.currency || "USD";
  const logoUrl = storeConfig?.logo?.url || storeConfig?.logoUrl || "";

  const handlePrint = () => {
    const html = buildInvoiceHtml({ order, businessName, invoiceNote, logoUrl, currency });
    const win = window.open("", "_blank", "width=820,height=900");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.onload = () => {
      win.focus();
      win.print();
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-16 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <div>
            <div className="text-sm font-medium text-zinc-950">Generar Factura</div>
            <div className="mt-0.5 text-xs text-zinc-500">Pedido #{String(order._id || "").slice(-8).toUpperCase()}</div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center text-zinc-400 transition-colors hover:text-zinc-700"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 p-5">
          <TextInput
            label="Nombre del negocio"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Nombre que aparecerá en la factura"
          />

          <TextareaField
            label="Nota (opcional)"
            value={invoiceNote}
            onChange={(e) => setInvoiceNote(e.target.value)}
            placeholder="Condiciones de pago, agradecimiento, instrucciones..."
          />

          <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
            <div className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-400">Vista previa del pedido</div>
            <div className="text-sm font-medium text-zinc-950">{order.customerName}</div>
            <div className="mt-0.5 text-xs text-zinc-500">{order.phone} · {order.address}</div>
            <div className="mt-3 divide-y divide-zinc-200/80 border border-zinc-200">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex items-center justify-between px-3 py-2 text-xs">
                  <span className="text-zinc-700">{item.name} ×{item.quantity}</span>
                  <span className="font-medium text-zinc-950">{formatCurrency(item.lineTotal, currency)}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-sm font-semibold text-zinc-950">
              <span>Total</span>
              <span>{formatCurrency(order.total, currency)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-zinc-200 px-5 py-4">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={handlePrint}>Imprimir / Descargar PDF</Button>
        </div>
      </div>
    </div>
  );
}
