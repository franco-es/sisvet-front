import { http } from "../../api/http";

export default async function updatePet(
  token,
  name,
  speciesId,
  breed,
  color,
  birthDate,
  idPet
) {
  const body = {
    name,
    speciesId,
    breed,
    color,
    birthDate,
  };
  const res = await http.put(`/pets/${idPet}`, body);
  return res;
}
