import { http } from "../../api/http";

export default async function addEditOwnerAPI(
  token,
  idPet,
  firstName,
  lastName,
  phone,
  address,
  email,
  type
) {
  const data = {
    firstName,
    lastName,
    phone,
    address,
    email,
  };
  console.log(type);
  if (type === "update") {
    return http.put(`/owners/${idPet}`, data);
  }
  return http.post(`/owners/create/${idPet}`, data);
}
