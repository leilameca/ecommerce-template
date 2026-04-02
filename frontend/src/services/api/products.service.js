import { apiRequest, buildQueryString } from "./client";

export function getProducts(params = {}) {
  return apiRequest(`/products${buildQueryString(params)}`);
}

export function getProductBySlug(slug) {
  return apiRequest(`/products/slug/${slug}`);
}

export function createProduct(payload) {
  return apiRequest("/products", {
    method: "POST",
    body: payload,
  });
}

export function updateProduct(productId, payload) {
  return apiRequest(`/products/${productId}`, {
    method: "PUT",
    body: payload,
  });
}

export function deleteProduct(productId) {
  return apiRequest(`/products/${productId}`, {
    method: "DELETE",
  });
}
