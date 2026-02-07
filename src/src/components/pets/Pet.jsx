// LIBRERIAS REQUERIDAS
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
// IMPORTACIONES PROPIAS
import UniquePet from "../../services/pets/uniquePet";
import ListConsultas from "./Consultas/ListConsultas";
import ListVacunas from "./Vacunas/ListVacunas";
import ListCirugias from "./Cirugias/ListCirugias";
import Owner from "../owner/Owner";
import EditPet from "./EditPet";
import updatePet from "../../services/pets/editPet";
import moment from "moment";

const Pet = (props) => {
  const [token] = useState(localStorage.getItem("token"));
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState("");
  const [edad, setEdad] = useState("");
  const [owner] = useState({});
  const [consultas, setConsultas] = useState([]);
  const [vacunas, setVacunas] = useState([]);
  const [cirugias, setCirugias] = useState([]);
  const [especie, setEspecie] = useState(localStorage.getItem("token"));
  const [raza, setRaza] = useState(localStorage.getItem("token"));
  const [showEditModal, setShowEditModal] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (token === null) {
      props.history.push("/auth");
    } else {
      Uniquepet();
    }
  }, [props.history, token]);

  const Uniquepet = async () => {
    await UniquePet(token, id).then((res) => {
      const data = res.data.pet;
      setNombre(data.nombre);
      setColor(data.color);
      setEspecie(data.especie);
      setRaza(data.raza);
      setEdad(data.f_nacimiento);
      setConsultas(data.consultas);
      setVacunas(data.vacunas);
      setCirugias(data.cirugia);
    });
  };

  const showEditModalFunction = () => {
    setShowEditModal(true);
  };

  const hideEditModalFunction = () => {
    setShowEditModal(false);
  };

  async function handleEditPet(nombre, raza, color, especie) {
    await updatePet(token, nombre, especie, raza, color, edad, id).then(
      (result) => {
        const data = result.data.pet;
        setNombre(data.nombre);
        setColor(data.color);
        setEspecie(data.especie);
        setRaza(data.raza);
        setEdad(data.f_nacimiento);
        console.log(data);
        hideEditModalFunction();
      }
    );
  }
  return (
    <Container className="mt-5">
      <div className="p-5 mb-4 bg-light rounded-3">
        <h1>Pets</h1>
        <p>Manage your pets here</p>
      </div>
      <Row>
        <Col xs={12} md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center">{nombre}</Card.Title>
              <Card.Text>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <b>Especie:</b> {especie}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <b>Pelaje:</b> {color}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <b>Raza:</b> {raza}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <b>Edad:</b> {moment(edad, "YYYY-MM-DD").fromNow(true)}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Text>
              <Button
                variant="outline-primary"
                onClick={showEditModalFunction}
              >
                Editar
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Owner owner={owner} />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="justify-content center" xs={12} md={4}>
          <ListConsultas idPet={id} consultas={consultas} token={token} />
        </Col>
        <Col className="justify-content center" xs={12} md={4}>
          <ListVacunas idPet={id} vacunas={vacunas} token={token} />
        </Col>
        <Col className="justify-content center" xs={12} md={4}>
          <ListCirugias idPet={id} cirugias={cirugias} token={token} />
        </Col>
      </Row>
      <EditPet
        show={showEditModal}
        handleCloseAddClick={hideEditModalFunction}
        handleEditPet={handleEditPet}
        nombre={nombre}
        especie={especie}
        f_nacimiento={edad}
        color={color}
        raza={raza}
      />
    </Container>
  );
};

export default Pet;
