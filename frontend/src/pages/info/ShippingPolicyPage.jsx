import PageSEO from "../../components/shared/PageSEO";
import { useLanguage } from "../../hooks/useLanguage";
import { useStoreConfig } from "../../hooks/useStoreConfig";

function PolicySection({ title, children }) {
  return (
    <div>
      <h2 className="text-base font-semibold tracking-[-0.02em] text-zinc-950">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-zinc-600">{children}</div>
    </div>
  );
}

export default function ShippingPolicyPage() {
  const { t, language } = useLanguage();
  const { config } = useStoreConfig();
  const contactEmail = config.contactEmail || "contact@example.com";
  const isEs = language === "es";

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageSEO title={t("shipping_title")} />

      <section className="max-w-2xl">
        <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-400">
          {t("shipping_eyebrow")}
        </span>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-4xl">
          {t("shipping_title")}
        </h1>
        <p className="mt-2 text-xs text-zinc-400">
          {t("policy_last_updated")}: {t("policy_date_placeholder")}
        </p>
      </section>

      <div className="max-w-3xl space-y-8 rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:p-10">
        {isEs ? (
          <>
            <PolicySection title="Tiempo de procesamiento">
              <p>Los pedidos se procesan en un plazo de 1 a 3 días hábiles. Durante períodos de alta demanda puede haber demoras adicionales. Recibirás una notificación cuando tu pedido sea despachado.</p>
            </PolicySection>
            <PolicySection title="Tiempos de entrega estimados">
              <p><strong>Local / Nacional:</strong> 3 a 7 días hábiles</p>
              <p><strong>Internacional:</strong> Variable según el destino. Contáctanos para confirmar disponibilidad a tu país.</p>
              <p>Los tiempos de entrega son estimaciones y pueden variar según el transportista y la ubicación.</p>
            </PolicySection>
            <PolicySection title="Costos de envío">
              <p>Los costos de envío se calculan en el checkout según el destino y el peso del pedido. Los pedidos con opción de envío gratuito se indicarán claramente en la tienda.</p>
            </PolicySection>
            <PolicySection title="Seguimiento de pedido">
              <p>Una vez despachado tu pedido, podrás consultar el estado en la página de seguimiento usando el ID de pedido que recibiste en tu correo de confirmación.</p>
            </PolicySection>
            <PolicySection title="Política de devoluciones">
              <p>Aceptamos devoluciones dentro de los <strong>14 días</strong> posteriores a la entrega, siempre que el producto:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Se encuentre en su estado original, sin uso</li>
                <li>Esté en su empaque original</li>
                <li>No sea un artículo de venta final</li>
              </ul>
            </PolicySection>
            <PolicySection title="Proceso de devolución">
              <p>Para iniciar una devolución, contáctanos en <a href={`mailto:${contactEmail}`} className="text-zinc-950 underline">{contactEmail}</a> indicando tu número de pedido y el motivo. Te guiaremos en los próximos pasos.</p>
            </PolicySection>
            <PolicySection title="Reembolsos">
              <p>Una vez recibido e inspeccionado el producto devuelto, procesaremos el reembolso al método de pago original dentro de los 5 a 10 días hábiles.</p>
            </PolicySection>
            <PolicySection title="Productos dañados o incorrectos">
              <p>Si recibes un producto dañado o incorrecto, contáctanos dentro de las <strong>48 horas</strong> posteriores a la entrega con fotografías del problema. Resolveremos el caso a la brevedad sin costo adicional para ti.</p>
            </PolicySection>
          </>
        ) : (
          <>
            <PolicySection title="Processing time">
              <p>Orders are processed within 1 to 3 business days. During periods of high demand there may be additional delays. You will receive a notification when your order is dispatched.</p>
            </PolicySection>
            <PolicySection title="Estimated delivery times">
              <p><strong>Local / National:</strong> 3 to 7 business days</p>
              <p><strong>International:</strong> Varies by destination. Contact us to confirm availability to your country.</p>
              <p>Delivery times are estimates and may vary depending on the carrier and location.</p>
            </PolicySection>
            <PolicySection title="Shipping costs">
              <p>Shipping costs are calculated at checkout based on destination and order weight. Orders with free shipping options will be clearly indicated in the store.</p>
            </PolicySection>
            <PolicySection title="Order tracking">
              <p>Once your order is dispatched, you can check its status on the tracking page using the order ID you received in your confirmation email.</p>
            </PolicySection>
            <PolicySection title="Return policy">
              <p>We accept returns within <strong>14 days</strong> of delivery, provided the product:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Is in its original, unused condition</li>
                <li>Is in its original packaging</li>
                <li>Is not a final-sale item</li>
              </ul>
            </PolicySection>
            <PolicySection title="Return process">
              <p>To initiate a return, contact us at <a href={`mailto:${contactEmail}`} className="text-zinc-950 underline">{contactEmail}</a> with your order number and the reason. We will guide you through the next steps.</p>
            </PolicySection>
            <PolicySection title="Refunds">
              <p>Once the returned product is received and inspected, we will process the refund to the original payment method within 5 to 10 business days.</p>
            </PolicySection>
            <PolicySection title="Damaged or incorrect items">
              <p>If you receive a damaged or incorrect product, contact us within <strong>48 hours</strong> of delivery with photos of the issue. We will resolve it promptly at no additional cost to you.</p>
            </PolicySection>
          </>
        )}
      </div>
    </div>
  );
}
