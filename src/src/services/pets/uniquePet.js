import axios from "axios";
const baseUrl = "http://localhost:8550/api";

export default function UniquePet(token, idPet) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${baseUrl}/pet/single?idPet=${idPet}`, {
        headers: { authorization: token },
      })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
