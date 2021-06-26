import axios from "axios";
const baseUrl = "https://sis-vet.herokuapp.com/api";

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
