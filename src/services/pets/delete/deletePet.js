import { http } from "../../../api/http";

export default async function deletePet(token, idPet) {
  const res = await http.delete(`/pet/delete?idPet=${idPet}`);
  return res;
}
