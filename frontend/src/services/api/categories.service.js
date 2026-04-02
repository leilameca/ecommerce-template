import { apiRequest } from "./client";

export function getCategories() {
  return apiRequest("/categories");
}

export function createCategory(payload) {
  return apiRequest("/categories", {
    method: "POST",
    body: payload,
  });
}

export function updateCategory(categoryId, payload) {
  return apiRequest(`/categories/${categoryId}`, {
    method: "PUT",
    body: payload,
  });
}

export function deleteCategory(categoryId) {
  return apiRequest(`/categories/${categoryId}`, {
    method: "DELETE",
  });
}
