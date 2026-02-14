import { http } from "../../api/http";

export default async function newConsult(
  token,
  date,
  consulta,
  tratamiento,
  diagnostico,
  idPet
) {
  const body = {
    fecha: date,
    contenido: consulta,
    tratamiento,
    diagnostico,
  };
  const res = await http.post(`/consulta/new?idPet=${idPet}`, body);
  return res;
}
