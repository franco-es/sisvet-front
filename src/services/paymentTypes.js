import { http } from "../api/http";

export async function listPaymentTypes() {
  const res = await http.get("/payment-types");
  return res.data;
}

export async function getPaymentType(id) {
  const res = await http.get(`/payment-types/${id}`);
  return res.data;
}

export async function createPaymentType(body) {
  const res = await http.post("/payment-types", body);
  return res.data;
}

export async function updatePaymentType(id, body) {
  const res = await http.put(`/payment-types/${id}`, body);
  return res.data;
}

export async function deletePaymentType(id) {
  await http.delete(`/payment-types/${id}`);
}
