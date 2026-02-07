import axios from "axios";
const baseUrl = "http://localhost:8550/api";

export default function deletePet(token, idPet) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${baseUrl}/pet/delete?idPet=${idPet}`, {
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
