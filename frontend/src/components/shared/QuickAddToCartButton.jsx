import { useNavigate } from "react-router-dom";

import { useCart } from "../../hooks/useCart";
import { useLanguage } from "../../hooks/useLanguage";
import { ROUTE_PATHS } from "../../routes/route-paths";

function CartPlusIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 8V6a5 5 0 0 1 10 0v2" />
      <path d="M5 8h14l-1 10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 8Z" />
      <path d="M12 11v5" />
      <path d="M9.5 13.5h5" />
    </svg>
  );
}

export default function QuickAddToCartButton({
  product,
  className = "",
  size = "md",
}) {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isOutOfStock = !product?.stock || product.stock <= 0;
  const hasVariants = Array.isArray(product?.variants) && product.variants.length > 0;
  const sizeClassName =
    {
      sm: "h-10 w-10",
      md: "h-11 w-11",
    }[size] || "h-11 w-11";

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isOutOfStock) {
      return;
    }

    if (hasVariants) {
      navigate(ROUTE_PATHS.productDetail.replace(":slug", product.slug));
      return;
    }

    addItem(product, 1);
  };

  const label = isOutOfStock
    ? t("product_card_out_of_stock")
    : t("product_detail_add_to_cart");

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={isOutOfStock}
      onClick={handleClick}
      className={[
        "inline-flex items-center justify-center rounded-full border border-zinc-950 bg-zinc-950 text-white shadow-[0_16px_40px_rgba(15,23,42,0.14)] transition-colors duration-200 hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-white disabled:text-zinc-300",
        sizeClassName,
        className,
      ].join(" ")}
    >
      <CartPlusIcon />
      <span className="sr-only">{label}</span>
    </button>
  );
}
