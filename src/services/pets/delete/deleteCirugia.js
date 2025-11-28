import axios from "axios";
const baseUrl = "http://localhost:8550/api";

export default function deleteConsult(token, idPet, idCirugia) {
  return new Promise((resolve, reject) => {
    axios
      .delete(
        `${baseUrl}/cirugia/delete?idPet=${idPet}&idCirugia=${idCirugia}`,
        {
          headers: {
            authorization: token,
          },
        }
      )
      .then((response) => {
        resolve(response);
      })
      .catch((err) => reject(err));
  });
}
