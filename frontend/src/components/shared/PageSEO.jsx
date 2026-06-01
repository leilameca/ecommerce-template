import { Helmet } from "react-helmet-async";

import { useStoreConfig } from "../../hooks/useStoreConfig";

export default function PageSEO({ title, description, image, canonical }) {
  const { config } = useStoreConfig();
  const storeName = config.storeName || "Commerce Studio";
  const fullTitle = title ? `${title} | ${storeName}` : storeName;
  const metaDescription = description || config.heroCopy || `Shop at ${storeName}`;
  const ogImage = image || config.heroImage || config.logoUrl || "";
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const canonicalUrl = canonical || (typeof window !== "undefined" ? window.location.href : "");

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      <meta property="og:site_name" content={storeName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}

      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}
