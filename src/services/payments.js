import { http } from "../api/http";

export async function getMercadoPagoStatus() {
  const res = await http.get("/payments/mercadopago/status");
  return res.data;
}

export async function getMercadoPagoConfig() {
  const res = await http.get("/admin/mercadopago/config");
  if (res.status === 204 || res.data == null || res.data === "") return null;
  return res.data;
}

export async function updateMercadoPagoConfig(config) {
  await http.put("/admin/mercadopago/config", config);
}

export async function createMercadoPagoPreference(saleId) {
  const res = await http.post(
    `/sales/${saleId}/payments/mercadopago/preference`
  );
  return res.data;
}
