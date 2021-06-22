// LIBRERIAS REQUERIDAS
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/card";
import Jumbotron from "react-bootstrap/jumbotron";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// IMPORTACIONES PROPIAS
import UniquePet from "../../services/pets/uniquePet";
import ListConsultas from "./ListConsultas";
import ListVacunas from "./ListVacunas";
import ListCirugias from "./ListCirugias";

const Pet = (props) => {
  const [token] = useState(localStorage.getItem("token"));
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState("");
  const [consultas, setConsultas] = useState([]);
  const [vacunas, setVacunas] = useState([]);
  const [cirugias, setCirugias] = useState([]);
  const [especie, setEspecie] = useState(localStorage.getItem("token"));
  const [raza, setRaza] = useState(localStorage.getItem("token"));
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
      setConsultas(data.consultas);
      setVacunas(data.vacunas);
      setCirugias(data.cirugia);
    });
  };
  return (
    <div>
      <Jumbotron>
        <Row>
          <Col xs={12} md={6}>
            <Card>
              <Card.Body>
                <Card.Title>{nombre}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {especie}
                </Card.Subtitle>
                <Card.Text>
                  <li>pelaje: {color}</li>
                  <li>raza: {raza}</li>
                </Card.Text>
                <Card.Link href="#">Card Link</Card.Link>
                <Card.Link href="#">Another Link</Card.Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Jumbotron>
      <Row className="mt-3">
        <Col className="justify-content center" xs={12} md={4}>
          <ListConsultas consultas={consultas} />
        </Col>
        <Col className="justify-content center" xs={12} md={4}>
          <ListVacunas vacunas={vacunas} />
        </Col>
        <Col className="justify-content center" xs={12} md={4}>
          <ListCirugias cirugias={cirugias} />
        </Col>
      </Row>
    </div>
  );
};

export default Pet;
