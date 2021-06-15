import axios from "axios";
const baseUrl = "http://localhost:8550/api";
const token = localStorage.getItem("token");

export default function listPets() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${baseUrl}/pet/all`, { headers: { authorization: token } })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
