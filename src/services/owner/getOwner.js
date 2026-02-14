import { http } from "../../api/http";

export default async function getOwner(token, idPet) {
  const res = await http.get(`/owners/by-pet/${idPet}`);
  return res;
}
