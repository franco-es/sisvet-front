import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

// FUNCIONES DE Pets
import listPets from "../../services/pets/listPets";
import createPet from "../../services/pets/createPet";

const Pets = (props) => {
  const [Mascotas, setMascotas] = React.useState([]);
  const [authToken] = React.useState(localStorage.getItem("token"));
  const [petNombre, setPetNombre] = React.useState("");
  const [petEspecie, setPetEspecie] = React.useState("");
  const [petRaza, setPetRaza] = React.useState("");
  const [petColor, setPetColor] = React.useState("");
  const [petF_Nacimiento, setPetF_Nacimiento] = React.useState([]);
  const [userAuth, setUserAuth] = React.useState(null);
  const [modoEdicion, setModoEdicion] = React.useState(false);

  useEffect(() => {
    if (authToken === null) {
      props.history.push("/auth");
    } else {
      const user = localStorage.getItem("user");
      setUserAuth(JSON.parse(user));
      listAllPets();
    }
  }, [props.history]);

  const listAllPets = async () => {
    await listPets(authToken).then((res) => {
      console.log(res.data.pet);
      setMascotas(res.data.pet);
    });
  };

  const addPet = async (e) => {
    e.preventDefault();
    await createPet(
      authToken,
      petNombre,
      petEspecie,
      petRaza,
      petColor,
      petF_Nacimiento
    )
      .then((res) => {
        console.log(res);
        setMascotas([...Mascotas, { ...res.data.mascota }]);
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
    console.log(Mascotas);
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
              {Mascotas.map((pet) => (
                <tr key={pet._id}>
                  <td></td>
                  <td>
                    <Link to={`/pets/${pet._id}`}>{pet.nombre}</Link>
                  </td>
                  <td>{pet.raza}</td>
                  <th>{pet.owner ? pet.owner.nombre : "propietario"}</th>
                  <td>
                    <i className="far fa-edit" onClick={editPet}></i>
                  </td>
                  <td>
                    <i className="far fa-trash-alt" onClick={deletePet}></i>
                  </td>
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
              type="date"
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
