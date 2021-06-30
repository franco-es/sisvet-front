import axios from "axios";
const baseUrl = "https://sis-vet.herokuapp.com/api";

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
