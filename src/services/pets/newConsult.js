import axios from "axios";
const baseUrl = "https://sis-vet.herokuapp.com/api";
// const token = localStorage.getItem("token");

export default function newConsult(
  token,
  date,
  consulta,
  tratamiento,
  diagnostico,
  idPet
) {
  return new Promise((resolve, reject) => {
    const pet = {
      fecha: date,
      contenido: consulta,
      tratamiento,
      diagnostico,
    };
    axios
      .post(`${baseUrl}/consulta/new?idPet=${idPet}`, pet, {
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
