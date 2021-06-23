import axios from "axios";
const baseUrl = "https://sis-vet.herokuapp.com/api";

export default function newConsult(token, date, contenido, idPet) {
  return new Promise((resolve, reject) => {
    const pet = {
      fecha: date,
      contenido: contenido,
    };
    console.log(pet);
    axios
      .post(`${baseUrl}/cirugia/new?idPet=${idPet}`, pet, {
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
