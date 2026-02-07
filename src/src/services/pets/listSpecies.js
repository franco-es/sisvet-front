import { http } from "../../api/http";


export async function listSpecies(){
  const res = await http.get("/species");
  return res.data;
}
