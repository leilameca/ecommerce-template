import { useEffect, useState } from "react";

import { getCategories } from "../services/api/categories.service";
import { getProducts } from "../services/api/products.service";

export function useCatalogData({ page, limit = 12 }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const response = await getCategories();

        if (!isMounted) {
          return;
        }

        setCategories(response?.data || []);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setCategories([]);
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getProducts({ page, limit });

        if (!isMounted) {
          return;
        }

        setProducts(response?.data || []);
        setPagination(response?.pagination || null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setProducts([]);
        setPagination(null);
        setErrorMessage(
          error?.message || "Products could not be loaded at this time."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [page, limit]);

  return {
    products,
    categories,
    pagination,
    isLoading,
    errorMessage,
  };
}
