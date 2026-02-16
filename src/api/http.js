// src/api/http.js
import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:8080/api", // sin / al final
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // ponlo en true solo si usas cookies
});

// (opcional) adjuntar JWT automáticamente si existe
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Para FormData (multipart) no enviar Content-Type: el navegador lo setea con el boundary
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});
