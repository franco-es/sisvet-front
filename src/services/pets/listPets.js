import { http } from "../../api/http";


export async function listPets(){
  const res = await http.get("/pets");
  return res.data;
}
