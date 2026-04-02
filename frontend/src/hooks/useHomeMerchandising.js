import { useEffect, useState } from "react";

import { getCategories } from "../services/api/categories.service";
import { getProducts } from "../services/api/products.service";

export function useHomeMerchandising() {
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadMerchandising = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          getCategories(),
          getProducts({ page: 1, limit: 4 }),
        ]);

        if (!isMounted) {
          return;
        }

        setFeaturedCategories((categoriesResponse?.data || []).slice(0, 3));
        setFeaturedProducts(productsResponse?.data || []);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setFeaturedCategories([]);
        setFeaturedProducts([]);
        setErrorMessage(
          error?.message || "Homepage merchandising could not be loaded."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMerchandising();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    featuredCategories,
    featuredProducts,
    isLoading,
    errorMessage,
  };
}
