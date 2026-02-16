import { http } from "../api/http";

// —— Ventas ——

export async function listSales() {
  const res = await http.get("/sales");
  return res.data;
}

export async function getSale(id) {
  const res = await http.get(`/sales/${id}`);
  return res.data;
}

export async function createSale(body) {
  const res = await http.post("/sales", body);
  return res.data;
}

export async function cancelSale(id) {
  const res = await http.post(`/sales/${id}/cancel`);
  return res.data;
}

/** Emite factura electrónica (AFIP). Requiere venta completada y sin CAE. Devuelve SaleDto actualizado. */
export async function emitElectronicInvoice(saleId) {
  const res = await http.post(`/sales/${saleId}/emit-electronic-invoice`);
  return res.data;
}

// —— Productos ——

export async function listProducts() {
  const res = await http.get("/products");
  return res.data;
}

export async function getProduct(id) {
  const res = await http.get(`/products/${id}`);
  return res.data;
}

export async function createProduct(body) {
  const res = await http.post("/products", body);
  return res.data;
}

export async function updateProduct(id, body) {
  const res = await http.put(`/products/${id}`, body);
  return res.data;
}

export async function deleteProduct(id) {
  const res = await http.delete(`/products/${id}`);
  return res.data;
}
