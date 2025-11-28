// src/api/auth.js
import { http } from "../../api/http";

export async function login(email, password) {
  const body = { email, password };
  const res = await http.post("/auth/login", body);
  // asumiendo que el back responde { token: "..." }
  if (res.data && res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data; // devuelve { token, ... } o lo que envíe tu back
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}
