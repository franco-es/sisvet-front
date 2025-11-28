import axios from "axios";
const baseUrl = "http://localhost:8550/api";

export default function getOwner(token, idPet) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${baseUrl}/owner/getOwner?idPet=${idPet}`, {
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
