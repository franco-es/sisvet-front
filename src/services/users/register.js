
import { http } from "../../api/http";

export async function register(email, password, name){
  const register = {
    email,
    password,
    nombre: name,
    rol:"vete"
  }

  const res = await http.post("/auth/register", register);
  return res.data;
}
