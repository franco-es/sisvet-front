import axios from "axios";
const baseUrl = "https://sis-vet.herokuapp.com/api";

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
