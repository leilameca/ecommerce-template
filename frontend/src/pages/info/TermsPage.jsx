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

export default function TermsPage() {
  const { t, language } = useLanguage();
  const { config } = useStoreConfig();
  const storeName = config.storeName || "Commerce Studio";
  const contactEmail = config.contactEmail || "contact@example.com";
  const isEs = language === "es";

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageSEO title={t("terms_title")} />

      <section className="max-w-2xl">
        <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-400">
          {t("terms_eyebrow")}
        </span>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-4xl">
          {t("terms_title")}
        </h1>
        <p className="mt-2 text-xs text-zinc-400">
          {t("policy_last_updated")}: {t("policy_date_placeholder")}
        </p>
      </section>

      <div className="max-w-3xl space-y-8 rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:p-10">
        {isEs ? (
          <>
            <PolicySection title="1. Aceptación de los términos">
              <p>Al acceder o realizar una compra en <strong>{storeName}</strong>, aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo, por favor no uses la tienda.</p>
            </PolicySection>
            <PolicySection title="2. Productos y disponibilidad">
              <p>Nos reservamos el derecho de modificar o descontinuar productos sin previo aviso. Los precios pueden cambiar en cualquier momento. En caso de error de precio, nos reservamos el derecho de cancelar el pedido y notificarte.</p>
            </PolicySection>
            <PolicySection title="3. Pedidos y pago">
              <p>Al realizar un pedido, confirmas que la información proporcionada es correcta. Aceptamos los métodos de pago indicados en el checkout. El pedido se considera confirmado una vez procesado el pago.</p>
            </PolicySection>
            <PolicySection title="4. Envíos">
              <p>Los tiempos de entrega son estimados y pueden variar según la ubicación y disponibilidad del transportista. No somos responsables por retrasos causados por terceros.</p>
            </PolicySection>
            <PolicySection title="5. Devoluciones y reembolsos">
              <p>Consulta nuestra Política de Envíos y Devoluciones para conocer las condiciones y plazos aplicables a cada caso.</p>
            </PolicySection>
            <PolicySection title="6. Propiedad intelectual">
              <p>Todo el contenido de esta tienda (imágenes, textos, diseño) es propiedad de {storeName} o sus proveedores y está protegido por derechos de autor. No está permitida su reproducción sin autorización.</p>
            </PolicySection>
            <PolicySection title="7. Limitación de responsabilidad">
              <p>En la medida permitida por la ley, {storeName} no será responsable por daños indirectos, incidentales o consecuentes derivados del uso de la tienda o de los productos adquiridos.</p>
            </PolicySection>
            <PolicySection title="8. Contacto">
              <p>Para cualquier consulta sobre estos términos, contáctanos en <a href={`mailto:${contactEmail}`} className="text-zinc-950 underline">{contactEmail}</a>.</p>
            </PolicySection>
          </>
        ) : (
          <>
            <PolicySection title="1. Acceptance of terms">
              <p>By accessing or making a purchase at <strong>{storeName}</strong>, you accept these terms and conditions in full. If you do not agree, please do not use the store.</p>
            </PolicySection>
            <PolicySection title="2. Products and availability">
              <p>We reserve the right to modify or discontinue products without prior notice. Prices may change at any time. In the event of a pricing error, we reserve the right to cancel the order and notify you.</p>
            </PolicySection>
            <PolicySection title="3. Orders and payment">
              <p>By placing an order, you confirm that the information provided is accurate. We accept the payment methods listed at checkout. An order is considered confirmed once payment is processed.</p>
            </PolicySection>
            <PolicySection title="4. Shipping">
              <p>Delivery times are estimates and may vary based on location and carrier availability. We are not responsible for delays caused by third parties.</p>
            </PolicySection>
            <PolicySection title="5. Returns and refunds">
              <p>Please refer to our Shipping & Returns Policy for the conditions and timeframes applicable to each case.</p>
            </PolicySection>
            <PolicySection title="6. Intellectual property">
              <p>All content on this store (images, text, design) is owned by {storeName} or its suppliers and is protected by copyright. Reproduction without authorization is not permitted.</p>
            </PolicySection>
            <PolicySection title="7. Limitation of liability">
              <p>To the extent permitted by law, {storeName} shall not be liable for indirect, incidental, or consequential damages arising from the use of the store or the products purchased.</p>
            </PolicySection>
            <PolicySection title="8. Contact">
              <p>For any questions about these terms, contact us at <a href={`mailto:${contactEmail}`} className="text-zinc-950 underline">{contactEmail}</a>.</p>
            </PolicySection>
          </>
        )}
      </div>
    </div>
  );
}
