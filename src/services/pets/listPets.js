import axios from "axios";
const baseUrl = "https://sis-vet.herokuapp.com/api";
// const token = localStorage.getItem("token");

export default function listPets(token) {
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
