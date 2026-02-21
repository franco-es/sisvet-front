import { http } from "../api/http";

export async function addOwnerAPI(
  token,
  idPet,
  firstName,
  lastName,
  phone,
  address,
  email,
  type
) {
  return http.post(`/owners/create/${idPet}`, {
    firstName,
    lastName,
    phone,
    address,
    email,
  });
}

export async function editOwnerAPI(
  token,
  idPet,
  firstName,
  lastName,
  phone,
  address,
  email,
  type
) {
  return http.put(`/owners/by-pet/${idPet}`, {
    firstName,
    lastName,
    phone,
    address,
    email,
  });
}

export async function getOwner(token, idPet) {
  const res = await http.get(`/owners/by-pet/${idPet}`);
  return res;
}
