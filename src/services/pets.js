import { http } from "../api/http";

// —— Mascotas ——

/**
 * Lista mascotas. Si se pasa creatorId (id del usuario logueado), el backend puede filtrar por ese creador.
 */
export async function listPets(creatorId = null) {
  const url =
    creatorId != null ? `/pets?creatorId=${encodeURIComponent(creatorId)}` : "/pets";
  const res = await http.get(url);
  return res.data;
}

export async function createPet(token, name, speciesId, breed, color, birthDate) {
  const body = { name, speciesId, breed, color, birthDate };
  const res = await http.post("/pets", body);
  return res;
}

export async function updatePet(
  token,
  name,
  speciesId,
  breed,
  color,
  birthDate,
  idPet
) {
  const body = { name, speciesId, breed, color, birthDate };
  const res = await http.put(`/pets/${idPet}`, body);
  return res;
}

export async function UniquePet(token, idPet) {
  const res = await http.get(`/pets/${idPet}`);
  return res;
}

export async function listSpecies() {
  const res = await http.get("/species");
  return res.data;
}

export async function deletePet(token, idPet) {
  return http.delete(`/pet/delete?idPet=${idPet}`);
}

// —— Procedimientos (consultas, vacunas, cirugías) ——

export async function newConsult(
  token,
  symptoms,
  diagnosis,
  notes,
  performedAt,
  idPet
) {
  const body = {
    symptoms,
    diagnosis,
    type: "CONSULT",
    performedAt,
    notes,
  };
  return http.post(`/pets/${idPet}/procedures`, body);
}

export async function newVacuna(
  token,
  idPet,
  { vaccineName, dose, lotNumber, nextDoseAt, performedAt, notes }
) {
  const body = {
    vaccineName,
    dose,
    lotNumber,
    nextDoseAt,
    performedAt,
    notes,
    type: "VACCINE",
  };
  return http.post(`/pets/${idPet}/procedures`, body);
}

export async function newCirugia(
  token,
  idPet,
  {
    surgeryType,
    surgeon,
    anesthesiaType,
    scheduledAt,
    successful,
    performedAt,
    notes,
  }
) {
  const body = {
    surgeryType,
    surgeon,
    anesthesiaType,
    scheduledAt,
    successful,
    performedAt,
    notes,
    type: "SURGERY",
  };
  return http.post(`/pets/${idPet}/procedures`, body);
}

export async function editProcedure(token, idPet, procedureId, body) {
  return http.put(`/pets/${idPet}/procedures/${procedureId}`, body);
}

export async function deleteConsult(token, idPet, idProcedure) {
  return http.delete(`/pets/${idPet}/procedures/${idProcedure}`);
}

export async function deleteCirugia(token, idPet, idProcedure) {
  return http.delete(`/pets/${idPet}/procedures/${idProcedure}`);
}

export async function deleteVacuna(token, idPet, idProcedure) {
  return http.delete(`/pets/${idPet}/procedures/${idProcedure}`);
}
