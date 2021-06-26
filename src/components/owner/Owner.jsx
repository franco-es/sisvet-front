import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// BOOTSTRAP
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

// PROPIOS
import AddEditOwner from "./AddEditOwner";
import moment from "moment";
import getOwner from "../../services/owner/getOwner";

const Owner = (props) => {
  const [showOwnerModal, SetShowOwnerModal] = useState(false);
  const [token] = useState(localStorage.getItem("token"));

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
  const showOwnerModalFunction = () => {
    SetShowOwnerModal(true);
  };
  const hideOwnerModalFunction = () => {
    SetShowOwnerModal(false);
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Dueño</Card.Title>
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

          <Button
            variant="outline-primary"
            className="mr-2"
            onClick={showOwnerModalFunction}
          >
            Agregar
          </Button>
          {owner === true ? (
            <Button variant="outline-primary" onClick={showOwnerModalFunction}>
              Editar
            </Button>
          ) : null}
        </Card.Body>
      </Card>

      <AddEditOwner />
    </>
  );
};

export default Owner;
