import { http } from "../api/http";

export async function listInvoiceTypes() {
  const res = await http.get("/invoice-types");
  return res.data;
}

export async function getInvoiceType(id) {
  const res = await http.get(`/invoice-types/${id}`);
  return res.data;
}

export async function createInvoiceType(body) {
  const res = await http.post("/invoice-types", body);
  return res.data;
}

export async function updateInvoiceType(id, body) {
  const res = await http.put(`/invoice-types/${id}`, body);
  return res.data;
}

export async function deleteInvoiceType(id) {
  await http.delete(`/invoice-types/${id}`);
}
