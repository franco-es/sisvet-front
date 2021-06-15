import axios from "axios";
// import login from "./login";
const baseUrl = "http://localhost:8550/";

export default function register(email, password, name, phone) {
  return new Promise((resolve, reject) => {
    const userRegister = {
      email: email,
      password: password,
      nombre: name,
      telefono: phone,
    };
    axios
      .post(`${baseUrl}api/user/new`, userRegister)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
}
