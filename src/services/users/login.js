import axios from "axios";
const baseUrl = "https://sis-vet.herokuapp.com/";

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
