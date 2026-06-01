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

export default function PrivacyPage() {
  const { t, language } = useLanguage();
  const { config } = useStoreConfig();
  const storeName = config.storeName || "Commerce Studio";
  const contactEmail = config.contactEmail || "contact@example.com";

  const isEs = language === "es";

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageSEO title={t("privacy_title")} />

      <section className="max-w-2xl">
        <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-400">
          {t("privacy_eyebrow")}
        </span>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-4xl">
          {t("privacy_title")}
        </h1>
        <p className="mt-2 text-xs text-zinc-400">
          {t("policy_last_updated")}: {t("policy_date_placeholder")}
        </p>
      </section>

      <div className="max-w-3xl space-y-8 rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:p-10">
        {isEs ? (
          <>
            <PolicySection title="1. Información que recopilamos">
              <p>Cuando realizas un pedido o creas una cuenta en <strong>{storeName}</strong>, podemos recopilar la siguiente información: nombre completo, correo electrónico, número de teléfono, dirección de envío e historial de pedidos.</p>
              <p>También podemos recopilar información de uso como páginas visitadas, productos vistos y preferencias de idioma a través de cookies esenciales.</p>
            </PolicySection>
            <PolicySection title="2. Cómo usamos tu información">
              <p>Usamos la información recopilada para: procesar y gestionar tus pedidos, enviarte confirmaciones y actualizaciones de estado, responder a tus consultas de soporte, y mejorar la experiencia de la tienda.</p>
              <p>No usamos tu información para campañas de marketing sin tu consentimiento.</p>
            </PolicySection>
            <PolicySection title="3. Compartir información">
              <p>No vendemos ni alquilamos tu información personal a terceros. Podemos compartir datos con proveedores de pago (como Stripe) únicamente para procesar transacciones de forma segura.</p>
            </PolicySection>
            <PolicySection title="4. Seguridad">
              <p>Implementamos medidas técnicas razonables para proteger tu información. Los pagos online son procesados a través de Stripe, que cumple con el estándar PCI-DSS. No almacenamos datos de tarjeta de crédito.</p>
            </PolicySection>
            <PolicySection title="5. Cookies">
              <p>Usamos cookies esenciales para mantener tu sesión activa y tu carrito de compras. No usamos cookies de seguimiento de terceros sin tu consentimiento.</p>
            </PolicySection>
            <PolicySection title="6. Tus derechos">
              <p>Puedes solicitar el acceso, corrección o eliminación de tus datos personales en cualquier momento contactándonos en <a href={`mailto:${contactEmail}`} className="text-zinc-950 underline">{contactEmail}</a>.</p>
            </PolicySection>
            <PolicySection title="7. Cambios a esta política">
              <p>Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios significativos a través del correo electrónico registrado o mediante un aviso en la tienda.</p>
            </PolicySection>
            <PolicySection title="8. Contacto">
              <p>Si tienes preguntas sobre esta política, contáctanos en <a href={`mailto:${contactEmail}`} className="text-zinc-950 underline">{contactEmail}</a>.</p>
            </PolicySection>
          </>
        ) : (
          <>
            <PolicySection title="1. Information we collect">
              <p>When you place an order or create an account at <strong>{storeName}</strong>, we may collect: full name, email address, phone number, shipping address, and order history.</p>
              <p>We may also collect usage data such as pages visited, products viewed, and language preferences through essential cookies.</p>
            </PolicySection>
            <PolicySection title="2. How we use your information">
              <p>We use the information collected to: process and manage your orders, send you confirmations and status updates, respond to your support inquiries, and improve the store experience.</p>
              <p>We do not use your information for marketing campaigns without your consent.</p>
            </PolicySection>
            <PolicySection title="3. Sharing information">
              <p>We do not sell or rent your personal information to third parties. We may share data with payment providers (such as Stripe) solely to process transactions securely.</p>
            </PolicySection>
            <PolicySection title="4. Security">
              <p>We implement reasonable technical measures to protect your information. Online payments are processed through Stripe, which is PCI-DSS compliant. We do not store credit card data.</p>
            </PolicySection>
            <PolicySection title="5. Cookies">
              <p>We use essential cookies to maintain your session and shopping cart. We do not use third-party tracking cookies without your consent.</p>
            </PolicySection>
            <PolicySection title="6. Your rights">
              <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at <a href={`mailto:${contactEmail}`} className="text-zinc-950 underline">{contactEmail}</a>.</p>
            </PolicySection>
            <PolicySection title="7. Changes to this policy">
              <p>We may update this privacy policy occasionally. We will notify you of significant changes via the registered email or a notice in the store.</p>
            </PolicySection>
            <PolicySection title="8. Contact">
              <p>If you have questions about this policy, contact us at <a href={`mailto:${contactEmail}`} className="text-zinc-950 underline">{contactEmail}</a>.</p>
            </PolicySection>
          </>
        )}
      </div>
    </div>
  );
}
