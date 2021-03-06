import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// BOOTSTRAP
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

// PROPIOS
import AddEditOwner from "./AddEditOwner";
import addEditOwnerAPI from "../../services/owner/addOwner";
// import moment from "moment";
import getOwner from "../../services/owner/getOwner";

const Owner = (props) => {
  const [showOwnerModal, SetShowOwnerModal] = useState(false);
  const [token] = useState(localStorage.getItem("token"));
  const [isEdit, setIsEdit] = useState(false);

  const [owner, setOwner] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const { id } = useParams();

  useEffect(() => {
    handleGetOwner();
  }, []);

  const handleGetOwner = async () => {
    await getOwner(token, id).then((res) => {
      let owner = res.data.owner;
      console.log(owner);

      if (owner === undefined) {
        setOwner(false);
      } else {
        setOwner(true);
        setNombre(owner.nombre);
        setApellido(owner.apellido);
        setTelefono(owner.telefono);
        setDireccion(owner.direccion);
      }
    });
  };

  const showOwnerEditModalFunction = () => {
    setIsEdit(true);
    SetShowOwnerModal(true);
  };
  const showOwnerModalFunction = () => {
    setIsEdit(false);
    SetShowOwnerModal(true);
  };
  const hideOwnerModalFunction = () => {
    SetShowOwnerModal(false);
  };

  async function addOwner(nombre, apellido, telefono, direccion, type) {
    console.log("entro por addOwner");
    await addEditOwnerAPI(
      token,
      id,
      nombre,
      apellido,
      telefono,
      direccion,
      type
    ).then((res) => {
      var data = res.data.owner;
      setOwner(true);
      setNombre(data.owner.nombre);
      setApellido(data.owner.apellido);
      setTelefono(data.owner.telefono);
      setDireccion(data.owner.direccion);
      SetShowOwnerModal(false);
    });
  }

  async function editOwner(nombre, apellido, telefono, direccion, type) {
    console.log("entro por editOwner");
    console.log(type);
    await addEditOwnerAPI(
      token,
      id,
      nombre,
      apellido,
      telefono,
      direccion,
      type
    ).then((res) => {
      var data = res.data.owner;
      setNombre(data.owner.nombre);
      setApellido(data.owner.apellido);
      setTelefono(data.owner.telefono);
      setDireccion(data.owner.direccion);
      SetShowOwnerModal(false);
    });
  }
  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Propietario</Card.Title>
          <Card.Text>
            {owner === true ? (
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <b>Nombre:</b> {nombre}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Apellido:</b> {apellido}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Direccion:</b> {direccion}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Telefono:</b> {telefono}
                </ListGroup.Item>
              </ListGroup>
            ) : (
              <p>Agreguemos un owner</p>
            )}
          </Card.Text>

          {owner === true ? (
            <Button
              variant="outline-primary"
              onClick={showOwnerEditModalFunction}
            >
              Editar
            </Button>
          ) : (
            <Button
              variant="outline-primary"
              className="mr-2"
              onClick={showOwnerModalFunction}
            >
              Agregar
            </Button>
          )}
        </Card.Body>
      </Card>

      <AddEditOwner
        show={showOwnerModal}
        handleCloseAddClick={hideOwnerModalFunction}
        handleAddClick={addOwner}
        handleEditClick={editOwner}
        isEdit={isEdit}
        nombre={nombre}
        apellido={apellido}
        telefono={telefono}
        direccion={direccion}
        idPet={id}
      />
    </>
  );
};

export default Owner;
