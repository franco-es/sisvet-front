import { http } from "../../../api/http";

export default async function deleteCirugia(token, idPet, idCirugia) {
  const res = await http.delete(
    `/cirugia/delete?idPet=${idPet}&idCirugia=${idCirugia}`
  );
  return res;
}
