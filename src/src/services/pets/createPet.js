import axios from "axios";
const baseUrl = "http://localhost:8550/api";
// const token = localStorage.getItem("token");

import { http } from "../../api/http";

export async function createPet(
  token,
  name,
  species,
  breed,
  color,
  birthDate
) {

  const body = {
    name,
    species,
    breed,
    color,
    birthDate
  }

  const res = await http.post("/pets", body)
  return res;
}
