import axios from "axios";
const baseUrl = "https://sis-vet.herokuapp.com/api";

export default function addEditOwnerAPI(
  token,
  idPet,
  nombre,
  apellido,
  telefono,
  direccion
) {
  return new Promise((resolve, reject) => {
    const data = {
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      direccion: direccion,
    };

    axios
      .post(`${baseUrl}/owner/new?idPet=${idPet}`, data, {
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
