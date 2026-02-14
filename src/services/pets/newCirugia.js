import { http } from "../../api/http";

export default async function newCirugia(token, date, contenido, idPet) {
  const body = {
    fecha: date,
    contenido,
  };
  const res = await http.post(`/cirugia/new?idPet=${idPet}`, body);
  return res;
}
