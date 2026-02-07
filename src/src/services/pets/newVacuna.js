import axios from "axios";
const baseUrl = "http://localhost:8550/api";

export default function newConsult(
  token,
  date,
  vacuna,
  prox_aplicacion,
  idPet
) {
  return new Promise((resolve, reject) => {
    const pet = {
      fecha: date,
      nombre: vacuna,
      prox_aplicacion: prox_aplicacion,
    };
    console.log(pet);
    axios
      .post(`${baseUrl}/vacuna/new?idPet=${idPet}`, pet, {
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
