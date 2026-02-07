import axios from "axios";
const baseUrl = "http://localhost:8550/api";
// const token = localStorage.getItem("token");

export default function updatePet(
  token,
  nombre,
  especie,
  raza,
  color,
  f_nacimiento,
  idPet
) {
  return new Promise((resolve, reject) => {
    const pet = {
      nombre,
      especie,
      raza,
      color,
      f_nacimiento,
    };
    // console.log(pet);
    axios
      .put(`${baseUrl}/pet/update?idPet=${idPet}`, pet, {
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
