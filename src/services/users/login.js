import axios from "axios";
const baseUrl = "http://localhost:8550/";

export default function login(email, password) {
  return new Promise((resolve, reject) => {
    const user = {
      email: email,
      password: password,
      getToken: true,
    };
    axios
      .post(`${baseUrl}api/user/login`, user)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
