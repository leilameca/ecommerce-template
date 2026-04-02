import { useEffect, useState } from "react";

import { getProductBySlug } from "../services/api/products.service";

export function useProductDetail(slug) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      if (!slug) {
        setProduct(null);
        setErrorMessage("Product slug is required.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getProductBySlug(slug);

        if (!isMounted) {
          return;
        }

        setProduct(response?.data || null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setProduct(null);
        setErrorMessage(
          error?.message || "Product details could not be loaded at this time."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return {
    product,
    isLoading,
    errorMessage,
  };
}
