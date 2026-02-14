import { http } from "../../api/http";

export async function createPet(
  token,
  name,
  speciesId,
  breed,
  color,
  birthDate
) {
  const body = {
    name,
    speciesId,
    breed,
    color,
    birthDate,
  };
  const res = await http.post("/pets", body);
  return res;
}
