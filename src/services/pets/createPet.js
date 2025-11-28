import { http } from "../../api/http";

export async function createPet(
  token,
  name,
  speciesName,
  breed,
  color,
  birthDate
) {

  const body = {
    name,
    speciesName,
    breed,
    color,
    birthDate
  }

  const res = await http.post("/pets", body)
  return res;
}
