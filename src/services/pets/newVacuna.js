import { http } from "../../api/http";

export default async function newVacuna(
  token,
  date,
  vacuna,
  prox_aplicacion,
  idPet
) {
  const body = {
    fecha: date,
    nombre: vacuna,
    prox_aplicacion,
  };
  const res = await http.post(`/vacuna/new?idPet=${idPet}`, body);
  return res;
}
