import { http } from "../api/http";

/**
 * Lista turnos del usuario. Opcional: from, to (ISO date-time), status (SCHEDULED | CANCELLED | COMPLETED).
 */
export async function listAppointments(params = {}) {
  const q = new URLSearchParams();
  if (params.from) q.set("from", params.from);
  if (params.to) q.set("to", params.to);
  if (params.status) q.set("status", params.status);
  const query = q.toString();
  const url = query ? `/appointments?${query}` : "/appointments";
  const res = await http.get(url);
  return res.data;
}

export async function getAppointment(id) {
  const res = await http.get(`/appointments/${id}`);
  return res.data;
}

/**
 * Body: { petId, scheduledAt (ISO), description? }
 */
export async function createAppointment(body) {
  const res = await http.post("/appointments", body);
  return res.data;
}

/**
 * Body: { petId?, scheduledAt?, description? }
 */
export async function updateAppointment(id, body) {
  const res = await http.put(`/appointments/${id}`, body);
  return res.data;
}

export async function patchAppointmentStatus(id, status) {
  const res = await http.patch(`/appointments/${id}/status?status=${encodeURIComponent(status)}`);
  return res.data;
}

export async function deleteAppointment(id) {
  await http.delete(`/appointments/${id}`);
}
