import { http } from "../../../api/http";

export default async function deleteVacuna(token, idPet, idVacuna) {
  const res = await http.delete(
    `/vacuna/delete?idPet=${idPet}&idVacuna=${idVacuna}`
  );
  return res;
}
