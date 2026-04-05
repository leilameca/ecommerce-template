import { apiRequest } from "./client";

export function uploadProductImage(file) {
  const formData = new FormData();

  formData.append("image", file);

  return apiRequest("/uploads", {
    method: "POST",
    body: formData,
  });
}
