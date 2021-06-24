import axios from "axios";
const baseUrl = "https://sis-vet.herokuapp.com/api";
// const token = localStorage.getItem("token");

export default function createPet(
  token,
  nombre,
  especie,
  raza,
  color,
  f_nacimiento
) {
  return new Promise((resolve, reject) => {
    const pet = {
      nombre,
      especie,
      raza,
      color,
      f_nacimiento,
    };
    console.log(pet);
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
