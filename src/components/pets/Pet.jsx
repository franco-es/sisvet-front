// LIBRERIAS REQUERIDAS
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/card";
import Jumbotron from "react-bootstrap/jumbotron";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
// IMPORTACIONES PROPIAS
import UniquePet from "../../services/pets/uniquePet";
import ListConsultas from "./Consultas/ListConsultas";
import ListVacunas from "./Vacunas/ListVacunas";
import ListCirugias from "./Cirugias/ListCirugias";
import Owner from "../owner/Owner";
import EditPet from "./EditPet";
import moment from "moment";

const Pet = (props) => {
  const [token] = useState(localStorage.getItem("token"));
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState("");
  const [edad, setEdad] = useState("");
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
      // console.log(data);
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
    console.log(nombre);
    console.log(raza);
    console.log(color);
    console.log(especie);
    console.log("editar");
  }
  return (
    <>
      <Jumbotron>
        <Row>
          <Col xs={12} md={6}>
            <Card>
              <Card.Body>
                <Card.Title className="text-center">{nombre}</Card.Title>
                <Card.Text>
                  <ListGroup variant="flush">
                    <ListGroup.Item>Especie: {especie}</ListGroup.Item>
                    <ListGroup.Item>Pelaje: {color}</ListGroup.Item>
                    <ListGroup.Item>Raza: {raza}</ListGroup.Item>
                    <ListGroup.Item>
                      Edad: {moment(edad, "YYYY-MM-DD").fromNow(true)}
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
            <Owner />
          </Col>
        </Row>
      </Jumbotron>
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
        color={color}
        raza={raza}
      />
    </>
  );
};

export default Pet;
