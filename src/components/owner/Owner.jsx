import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
// BOOTSTRAP
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

// PROPIOS
import AddEditOwner from "./AddEditOwner";
import { addOwnerAPI, editOwnerAPI, getOwner } from "../../services/owner";

const Owner = (props) => {
  const [showOwnerModal, SetShowOwnerModal] = useState(false);
  const [token] = useState(localStorage.getItem("token"));
  const [isEdit, setIsEdit] = useState(false);

  const [owner, setOwner] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");

  const { id } = useParams();

  const handleGetOwner = useCallback(async () => {
    try {
      const res = await getOwner(token, id);
      const ownerData = res.data?.owner ?? res.data;
      if (!ownerData) {
        setOwner(false);
        return;
      }
      setOwner(true);
      setNombre(ownerData.firstName ?? ownerData.nombre ?? "");
      setApellido(ownerData.lastName ?? ownerData.apellido ?? "");
      setTelefono(ownerData.phone ?? ownerData.telefono ?? "");
      setDireccion(ownerData.address ?? ownerData.direccion ?? "");
      setEmail(ownerData.email ?? "");
    } catch {
      setOwner(false);
    }
  }, [token, id]);

  useEffect(() => {
    handleGetOwner();
  }, [handleGetOwner]);

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

  async function addOwner(nombre, apellido, telefono, direccion, email, type) {
    await addOwnerAPI(
      token,
      id,
      nombre,
      apellido,
      telefono,
      direccion,
      email,
      type
    ).then((res) => {
      console.log(res);
      var data = res;
      setOwner(true);
      setNombre(data.firstName);
      setApellido(data.lastName);
      setTelefono(data.phone);
      setDireccion(data.address);
      setEmail(data.email);
      SetShowOwnerModal(false);
    });
  }

  async function editOwner(nombre, apellido, telefono, direccion, email, type) {
    await editOwnerAPI(
      token,
      id,
      nombre,
      apellido,
      telefono,
      direccion,
      email,
      type
    ).then((res) => {
      var data = res.data;
      setNombre(data.firstName);
      setApellido(data.lastName);
      setTelefono(data.phone);
      setDireccion(data.address);
      setEmail(data.email);
      SetShowOwnerModal(false);
    });
  }
  return (
    <>
      <Card className="card-sisvet border-0">
        <Card.Body>
          <Card.Title className="text-sisvet-cobalto">Propietario</Card.Title>
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
                <ListGroup.Item>
                  <b>Email:</b> {email}
                </ListGroup.Item>
              </ListGroup>
            ) : (
              <p>Agreguemos un owner</p>
            )}
          </Card.Text>

          {owner === true ? (
            <Button
              className="btn-sisvet-outline-cobalto"
              onClick={showOwnerEditModalFunction}
            >
              Editar
            </Button>
          ) : (
            <Button
              className="btn-sisvet-primary me-2"
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
        email={email}
        idPet={id}
      />
    </>
  );
};

export default Owner;
