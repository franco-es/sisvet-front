import axios from "axios";
const baseUrl = "http://localhost:8550/api";
const token = localStorage.getItem("token");

export default function createPet(nombre, especie, raza, color, f_nacimiento) {
  return new Promise((resolve, reject) => {
    const pet = {
      nombre,
      especie,
      raza,
      color,
      f_nacimiento,
    };
    axios
      .post(`${baseUrl}/pet/new`, pet, {
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
