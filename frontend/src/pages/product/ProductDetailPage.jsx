import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import PageSEO from "../../components/shared/PageSEO";
import ProductCard from "../../components/shared/ProductCard";
import Button from "../../components/ui/Button";
import { useCart } from "../../hooks/useCart";
import { useLanguage } from "../../hooks/useLanguage";
import { formatCurrency } from "../../lib/format-currency";
import { useProductDetail } from "../../hooks/useProductDetail";
import { useStoreConfig } from "../../hooks/useStoreConfig";
import { getProducts } from "../../services/api/products.service";
import { ROUTE_PATHS } from "../../routes/route-paths";

function ProductDetailSkeleton() {
  return (
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_460px]">
      <div className="space-y-4">
        <div className="aspect-[4/5] animate-pulse rounded-[2rem] bg-zinc-100" />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-square animate-pulse rounded-[1.25rem] bg-zinc-100" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-4 w-24 animate-pulse rounded-full bg-zinc-100" />
        <div className="h-12 w-4/5 animate-pulse rounded-[1rem] bg-zinc-100" />
        <div className="h-6 w-32 animate-pulse rounded-full bg-zinc-100" />
        <div className="h-4 w-full animate-pulse rounded-full bg-zinc-100" />
        <div className="h-4 w-5/6 animate-pulse rounded-full bg-zinc-100" />
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-zinc-100" />
      </div>
    </div>
  );
}

function ProductDetailState({ title, description, backLabel }) {
  return (
    <div className="rounded-[2rem] border border-rose-200 bg-rose-50/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:p-8 text-rose-900">
      <h1 className="text-2xl font-semibold tracking-[-0.04em]">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-current/75">{description}</p>
      <Link
        to={ROUTE_PATHS.catalog}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white hover:text-white [&_*]:text-inherit"
      >
        {backLabel}
      </Link>
    </div>
  );
}

function ProductImageGallery({ images, selectedImageIndex, onSelectImage }) {
  const selectedImage = images[selectedImageIndex] || images[0];
  const hasMultipleImages = images.length > 1;
  const handlePreviousImage = () => onSelectImage((selectedImageIndex - 1 + images.length) % images.length);
  const handleNextImage = () => onSelectImage((selectedImageIndex + 1) % images.length);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.05)]">
        <div className="relative aspect-[4/5] bg-zinc-100">
          {selectedImage?.url ? (
            <img src={selectedImage.url} alt={selectedImage.alt || "Product image"} className="h-full w-full object-contain p-4 sm:p-6" />
          ) : (
            <div className="flex h-full items-center justify-center bg-[linear-gradient(180deg,rgba(250,250,250,1),rgba(244,244,245,0.92))]">
              <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-400">Product</span>
            </div>
          )}
          {hasMultipleImages ? (
            <>
              <button type="button" className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/92 text-zinc-900 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-colors duration-200 hover:bg-zinc-50" onClick={handlePreviousImage} aria-label="Previous image">&#8249;</button>
              <button type="button" className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/92 text-zinc-900 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-colors duration-200 hover:bg-zinc-50" onClick={handleNextImage} aria-label="Next image">&#8250;</button>
            </>
          ) : null}
        </div>
      </div>
      {hasMultipleImages ? (
        <div className="grid grid-flow-col auto-cols-[5.25rem] gap-3 overflow-x-auto pb-1 sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-4 sm:overflow-visible sm:pb-0">
          {images.map((image, index) => (
            <button key={`${image.url || "image"}-${index}`} type="button"
              className={["w-[5.25rem] overflow-hidden rounded-[1.25rem] border bg-white transition-all duration-200 sm:w-auto", index === selectedImageIndex ? "border-zinc-950 shadow-[0_18px_44px_rgba(15,23,42,0.08)]" : "border-zinc-200/80 hover:border-zinc-300"].join(" ")}
              onClick={() => onSelectImage(index)}>
              <div className="aspect-square bg-zinc-100">
                {image.url ? <img src={image.url} alt={image.alt || `Product thumbnail ${index + 1}`} className="h-full w-full object-contain p-2" /> : <div className="h-full w-full bg-zinc-100" />}
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProductDetailsPanel({ product, currency, t }) {
  const categoryName = product.category?.name || "Collection";
  const stockLabel =
    product.stock > 0
      ? product.stock <= 5
        ? t("product_detail_limited_stock")
        : t("product_detail_ready")
      : t("product_detail_unavailable_stock");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [variantError, setVariantError] = useState("");
  const { addItem } = useCart();

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  const allVariantsSelected = !hasVariants || product.variants.every((v) => selectedVariants[v.name]);

  useEffect(() => {
    setQuantity(1);
    setSelectedVariants({});
    setVariantError("");
  }, [product._id]);

  const handleSelectVariant = (variantName, option) => {
    setSelectedVariants((prev) => ({ ...prev, [variantName]: option }));
    setVariantError("");
  };

  const handleAddToCart = () => {
    if (!allVariantsSelected) {
      setVariantError(t("product_detail_variants_required"));
      return;
    }
    addItem(product, quantity, selectedVariants);
    setVariantError("");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500">{categoryName}</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-400">{stockLabel}</span>
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-4xl lg:text-5xl">{product.name}</h1>
          <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-3xl">{formatCurrency(product.price, currency)}</div>
        </div>
        <p className="max-w-2xl text-[15px] leading-7 text-zinc-600 sm:text-base sm:leading-8">
          {product.description || t("product_detail_fallback_copy")}
        </p>
      </div>

      <div className="rounded-[1.5rem] border border-zinc-200/80 bg-white p-4 shadow-[0_18px_56px_rgba(15,23,42,0.05)] sm:p-5">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-400">{t("product_detail_category")}</div>
            <div className="mt-2 text-lg font-semibold tracking-[-0.03em] text-zinc-950">{categoryName}</div>
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-400">{t("product_detail_stock")}</div>
            <div className="mt-2 text-lg font-semibold tracking-[-0.03em] text-zinc-950">{product.stock}</div>
          </div>
        </div>

        {hasVariants ? (
          <div className="mt-6 space-y-5 border-t border-zinc-100 pt-6">
            <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-400">{t("product_detail_variants")}</div>
            {product.variants.map((variant) => (
              <div key={variant.name} className="space-y-2">
                <div className="text-sm font-medium text-zinc-700">
                  {t("product_detail_select_variant", { name: variant.name })}
                </div>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((option) => {
                    const isSelected = selectedVariants[variant.name] === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleSelectVariant(variant.name, option)}
                        className={[
                          "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150",
                          isSelected
                            ? "border-zinc-950 bg-zinc-950 text-white"
                            : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400",
                        ].join(" ")}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {variantError ? (
              <p className="text-xs text-rose-600">{variantError}</p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 p-1">
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-700 transition-colors duration-200 hover:bg-white" onClick={() => setQuantity((v) => Math.max(1, v - 1))}>-</button>
              <span className="min-w-8 text-center text-sm font-medium text-zinc-950">{quantity}</span>
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-700 transition-colors duration-200 hover:bg-white" disabled={quantity >= product.stock} onClick={() => setQuantity((v) => Math.min(product.stock, v + 1))}>+</button>
            </div>
            <span className="text-sm text-zinc-500">
              {product.stock > 0 ? t("product_detail_available", { count: product.stock }) : t("product_card_out_of_stock")}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button size="lg" className="w-full" disabled={product.stock <= 0} onClick={handleAddToCart}>
              {t("product_detail_add_to_cart")}
            </Button>
            <Link to={ROUTE_PATHS.cart} className="block">
              <Button variant="secondary" size="lg" className="w-full">{t("product_detail_view_cart")}</Button>
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link to={ROUTE_PATHS.catalog} className="inline-flex w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-6 py-3.5 text-sm font-medium text-zinc-900 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition-colors duration-200 hover:bg-zinc-50">
              {t("product_detail_back_to_catalog")}
            </Link>
            <Link to={ROUTE_PATHS.checkout} className="inline-flex w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-6 py-3.5 text-sm font-medium text-zinc-900 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition-colors duration-200 hover:bg-zinc-50">
              {t("product_detail_continue_checkout")}
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-zinc-200/80 bg-zinc-50/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.04)] sm:p-6">
        <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-400">{t("product_detail_notes")}</div>
        <p className="mt-4 text-sm leading-7 text-zinc-600">{t("product_detail_notes_copy")}</p>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const { product, isLoading, errorMessage } = useProductDetail(slug);
  const { config } = useStoreConfig();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const currency = config.currency || "USD";

  useEffect(() => { setSelectedImageIndex(0); }, [slug]);

  useEffect(() => {
    if (!product?.category?.slug) return;
    let cancelled = false;
    getProducts({ category: product.category.slug, limit: 5 })
      .then((res) => {
        if (cancelled) return;
        const list = (res?.data || []).filter((p) => p.slug !== product.slug).slice(0, 4);
        setRelatedProducts(list);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [product?.category?.slug, product?.slug]);

  if (isLoading) return <ProductDetailSkeleton />;

  if (errorMessage || !product) {
    return (
      <ProductDetailState
        title={t("product_detail_unavailable")}
        description={errorMessage || t("product_detail_not_found")}
        backLabel={t("product_detail_back_to_catalog")}
      />
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [{ url: "", alt: product.name }];

  const availability = product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || "",
    image: product.images?.map((img) => img.url).filter(Boolean) || [],
    sku: product._id,
    offers: {
      "@type": "Offer",
      priceCurrency: currency,
      price: product.price,
      availability,
      url: typeof window !== "undefined" ? window.location.href : "",
    },
  };

  return (
    <div className="space-y-4 sm:space-y-8">
      <PageSEO
        title={product.name}
        description={product.description}
        image={product.images?.[0]?.url}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400">
        {t("product_detail_eyebrow")}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px] xl:gap-12">
        <ProductImageGallery images={images} selectedImageIndex={selectedImageIndex} onSelectImage={setSelectedImageIndex} />
        <ProductDetailsPanel product={product} currency={currency} t={t} />
      </div>

      {relatedProducts.length > 0 ? (
        <section className="space-y-5 border-t border-zinc-200/80 pt-8">
          <h2 className="text-xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-2xl">
            {t("product_detail_related")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={{ ...p, currency }} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
