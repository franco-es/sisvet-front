import { http } from "../api/http";

// —— Mascotas ——
// Ver docs PET-ENDPOINTS.md: GET/POST/PUT/DELETE /api/pets

/**
 * Lista todas las mascotas del usuario. GET /api/pets
 */
export async function listPets(creatorId = null) {
  const res = await http.get("/pets");
  return res.data;
}

/**
 * Lista mascotas cuyo nombre contenga el texto. GET /api/pets?search=nombre
 */
export async function listPetsSearch(search = "") {
  const url = search.trim() ? `/pets?search=${encodeURIComponent(search.trim())}` : "/pets";
  const res = await http.get(url);
  return res.data;
}

/**
 * Devuelve una mascota por ID. GET /api/pets/{id}
 */
export async function getPet(id) {
  const res = await http.get(`/pets/${id}`);
  return res.data;
}

/**
 * Crea una mascota. POST /api/pets
 * Body PetDto: name (requerido), speciesId (recomendado), speciesName (opcional), breed, color, birthDate (opcionales).
 */
export async function createPet(token, name, speciesId, breed, color, birthDate, speciesName = null) {
  const body = { name: name ?? "" };
  const sid = speciesId != null && speciesId !== "" ? Number(speciesId) : undefined;
  if (sid != null) body.speciesId = sid;
  if (speciesName != null && speciesName !== "") body.speciesName = speciesName;
  if (breed != null && breed !== "") body.breed = breed;
  if (color != null && color !== "") body.color = color;
  if (birthDate != null && birthDate !== "") body.birthDate = birthDate;
  const res = await http.post("/pets", body);
  return res;
}

/**
 * Actualiza una mascota. PUT /api/pets/{id}
 * Body: mismo que crear (actualización parcial).
 */
export async function updatePet(
  token,
  name,
  speciesId,
  breed,
  color,
  birthDate,
  idPet
) {
  const body = {};
  if (name != null) body.name = name;
  const sid = speciesId != null && speciesId !== "" ? Number(speciesId) : undefined;
  if (sid != null) body.speciesId = sid;
  if (breed != null) body.breed = breed;
  if (color != null) body.color = color;
  if (birthDate != null) body.birthDate = birthDate;
  const res = await http.put(`/pets/${idPet}`, body);
  return res;
}

/**
 * @deprecated Usar getPet(id). Mantenido por compatibilidad.
 */
export async function UniquePet(token, idPet) {
  const res = await http.get(`/pets/${idPet}`);
  return res;
}

export async function listSpecies() {
  const res = await http.get("/species");
  return res.data;
}

/**
 * Elimina una mascota. DELETE /api/pets/{id} → 204 sin cuerpo.
 */
export function deletePet(token, idPet) {
  return http.delete(`/pets/${idPet}`);
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
