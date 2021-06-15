import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";

// FUNCIONES DE Pets
import listPets from "../../services/pets/listPets";
import createPet from "../../services/pets/createPet";

const Pets = (props) => {
  const [pets, setPets] = React.useState([]);
  const [petNombre, setPetNombre] = React.useState("");
  const [petEspecie, setPetEspecie] = React.useState("");
  const [petRaza, setPetRaza] = React.useState("");
  const [petColor, setPetColor] = React.useState("");
  const [petF_Nacimiento, setPetF_Nacimiento] = React.useState([]);
  const [userAuth, setUserAuth] = React.useState(null);
  const [modoEdicion, setModoEdicion] = React.useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      props.history.push("/auth");
    } else {
      setPets([]);
      const listAllPets = async () => {
        const data = await listPets();
        const pet = data.data.pet;
        const petData = pet.map((pet) => ({
          ...pet,
        }));
        // console.log(petData);
        setPets(petData);
      };
      const user = localStorage.getItem("user");
      setUserAuth(JSON.parse(user));
      listAllPets();
    }
  }, [setPets, props.history]);

  const addPet = async (e) => {
    e.preventDefault();
    await createPet(petNombre, petEspecie, petRaza, petColor, petF_Nacimiento)
      .then((res) => {
        console.log(res);
        setPets([...pets, { ...res.data.mascota }]);
        setPetNombre("");
        setPetEspecie("");
        setPetRaza("");
        setPetColor("");
        setPetF_Nacimiento("");
      })
      .catch((err) => {
        console.log(err);
        console.log("ocurrio un error");
      });
    console.log(pets);
  };

  const editPet = async () => {
    setModoEdicion(true);
    console.log("editar mascota");
  };
  const deletePet = async () => {
    console.log("eliminar mascota");
  };
  return (
    <div>
      {userAuth ? <h1>Bienvenido {userAuth.nombre}</h1> : <h1>Bienvenido</h1>}

      <div className="row">
        <div className="col-md-8">
          <h3 className="d-flex justify-content-center">Mascotas</h3>
          <table className="table">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Nombre</th>
                <th scope="col">Raza</th>
                <th scope="col">Dueño</th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet) => (
                <tr key={pet._id}>
                  <th></th>
                  <th>{pet.nombre}</th>
                  <th>{pet.raza}</th>
                  <th>{pet.owner ? pet.owner.nombre : "propietario"}</th>
                  <th>
                    <i className="far fa-edit" onClick={editPet}></i>
                  </th>
                  <th>
                    <i className="far fa-trash-alt" onClick={deletePet}></i>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-4">
          <h3 className="d-flex justify-content-center">
            {!modoEdicion ? "Agregar Mascota" : "Editar Mascota"}
          </h3>
          <form onSubmit={(e) => addPet(e)}>
            <input
              type="text"
              placeholder="Nombre"
              className="form-control mb-2"
              onChange={(e) => setPetNombre(e.target.value)}
              value={petNombre}
            />
            <input
              type="text"
              placeholder="Especie"
              className="form-control mb-2"
              onChange={(e) => setPetEspecie(e.target.value)}
              value={petEspecie}
            />
            <input
              type="text"
              placeholder="Raza"
              className="form-control mb-2"
              onChange={(e) => setPetRaza(e.target.value)}
              value={petRaza}
            />
            <input
              type="text"
              placeholder="Color"
              className="form-control mb-2"
              onChange={(e) => setPetColor(e.target.value)}
              value={petColor}
            />
            <input
              type="text"
              placeholder="Fecha de Nacimiento"
              className="form-control mb-2"
              onChange={(e) => setPetF_Nacimiento(e.target.value)}
              value={petF_Nacimiento}
            />
            <button className="btn btn-primary btn-block" type="submit">
              {modoEdicion ? "Editar" : "Agregar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Pets);
