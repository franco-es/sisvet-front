import { http } from "../../../api/http";

export default async function deleteConsult(token, idPet, idConsulta) {
  const res = await http.delete(
    `/consulta/delete?idPet=${idPet}&idConsulta=${idConsulta}`
  );
  return res;
}
