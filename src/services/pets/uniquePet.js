import { http } from "../../api/http";

export async function UniquePet(token, idPet) {
  const res = await http.get("/species/{idPet}");
  return res.data;
}
