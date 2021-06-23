import axios from "axios";
const baseUrl = "https://sis-vet.herokuapp.com/api";

export default function deleteConsult(token, idPet, idConsulta) {
  return new Promise((resolve, reject) => {
    axios
      .delete(
        `${baseUrl}/consulta/delete?idPet=${idPet}&idConsulta=${idConsulta}`,
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
