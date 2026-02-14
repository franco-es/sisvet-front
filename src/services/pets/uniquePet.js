import { http } from "../../api/http";

export default async function UniquePet(token, idPet) {
  const res = await http.get(`/pets/${idPet}`);
  return res;
}
