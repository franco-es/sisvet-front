import axios from "axios";
const baseUrl = "http://localhost:8550/api";

export default function deleteConsult(token, idPet, idVacuna) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${baseUrl}/vacuna/delete?idPet=${idPet}&idVacuna=${idVacuna}`, {
        headers: {
          authorization: token,
        },
      })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => reject(err));
  });
}
