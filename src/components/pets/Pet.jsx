// LIBRERIAS REQUERIDAS
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Card, Button, Row, Col, ListGroup } from "react-bootstrap";
// IMPORTACIONES PROPIAS
import { UniquePet, listSpecies, updatePet } from "../../services/pets";
import { downloadPetProceduresReport } from "../../services/reports";
import ListConsultas from "./Consultas/ListConsultas";
import ListVacunas from "./Vacunas/ListVacunas";
import ListCirugias from "./Cirugias/ListCirugias";
import Owner from "../owner/Owner";
import EditPet from "./EditPet";
import moment from "moment";

const Pet = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [token] = useState(localStorage.getItem("token"));
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState("");
  const [edad, setEdad] = useState("");
  const [owner] = useState({});
  const [consultas, setConsultas] = useState([]);
  const [vacunas, setVacunas] = useState([]);
  const [cirugias, setCirugias] = useState([]);
  const [especie, setEspecie] = useState("");
  const [raza, setRaza] = useState("");
  const [especieId, setEspecieId] = useState("");
  const [speciesList, setSpeciesList] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);

  const Uniquepet = useCallback(async () => {
    await UniquePet(token, id).then((res) => {
      const data = res.data?.pet ?? res.data ?? {};
      setNombre(data.nombre ?? data.name ?? "");
      setColor(data.color ?? "");
      setEspecie(data.speciesName ?? data.speciesName ?? "");
      setRaza(data.raza ?? data.breed ?? "");
      setEdad(data.f_nacimiento ?? data.birthDate ?? "");
      setEspecieId(data.speciesId ?? data.species_id ?? "");
      const procedures = data.procedures ?? [];
      setConsultas(procedures.filter((p) => p.type === "CONSULT"));
      setVacunas(procedures.filter((p) => p.type === "VACCINE"));
      setCirugias(procedures.filter((p) => p.type === "SURGERY"));
    });
  }, [token, id]);

  useEffect(() => {
    if (!token) {
      navigate("/auth");
    } else {
      Uniquepet();
    }
  }, [token, navigate, Uniquepet]);

  useEffect(() => {
    if (!token) return;
    listSpecies()
      .then((list) => {
        setSpeciesList(Array.isArray(list) ? list : []);
      })
      .catch(() => setSpeciesList([]));
  }, [token]);

  const showEditModalFunction = () => {
    setShowEditModal(true);
  };

  const hideEditModalFunction = () => {
    setShowEditModal(false);
  };

  async function handleEditPet(nombre, raza, color, speciesId, f_nacimiento) {
    await updatePet(token, nombre, speciesId, raza, color, f_nacimiento ?? edad, id).then(
      (result) => {
        const data = result.data?.pet ?? result.data ?? {};
        setNombre(data.nombre ?? data.name ?? nombre);
        setColor(data.color ?? color);
        setEspecie(data.especie ?? data.species ?? especie);
        setRaza(data.raza ?? data.breed ?? raza);
        setEdad(data.f_nacimiento ?? data.birthDate ?? f_nacimiento ?? edad);
        setEspecieId(data.speciesId ?? data.species_id ?? speciesId ?? "");
        hideEditModalFunction();
      }
    );
  }
  return (
    <Container fluid className="mt-5 px-3">
      <div className="hero-sisvet">
        <h1 className="mb-1">Pets</h1>
        <p className="mb-0 opacity-90">Gestiona tus mascotas aquí</p>
      </div>
      <Row>
        <Col xs={12} md={6}>
          <Card className="card-sisvet border-0">
            <Card.Body>
              <Card.Title className="text-center text-sisvet-cobalto">{nombre}</Card.Title>
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
              <div className="d-flex gap-2 flex-wrap">
                <Button
                  className="btn-sisvet-outline-cobalto"
                  onClick={showEditModalFunction}
                >
                  Editar
                </Button>
                <Button
                  as={Link}
                  to={`/turnos?petId=${id}`}
                  className="btn-sisvet-primary"
                >
                  <i className="far fa-calendar-plus me-1" aria-hidden="true" />
                  Agendar turno
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Owner owner={owner} />
        </Col>
      </Row>
      <Row className="mt-3 align-items-center">
        <Col>
          <span className="text-sisvet-cobalto fw-bold me-2">Informe de procedimientos</span>
          <Button
            size="sm"
            className="btn-sisvet-outline-cobalto me-1"
            onClick={() => downloadPetProceduresReport(id, "pdf")}
          >
            <i className="far fa-file-pdf me-1" /> PDF
          </Button>
          <Button
            size="sm"
            className="btn-sisvet-outline-cobalto"
            onClick={() => downloadPetProceduresReport(id, "excel")}
          >
            <i className="far fa-file-excel me-1" /> Excel
          </Button>
        </Col>
      </Row>
      <Row className="mt-4 g-3">
        <Col xs={12} lg={4}>
          <ListConsultas idPet={id} consultas={consultas} token={token} />
        </Col>
        <Col xs={12} lg={4}>
          <ListVacunas idPet={id} vacunas={vacunas} token={token} />
        </Col>
        <Col xs={12} lg={4}>
          <ListCirugias idPet={id} cirugias={cirugias} token={token} />
        </Col>
      </Row>
      <EditPet
        show={showEditModal}
        handleCloseAddClick={hideEditModalFunction}
        handleEditPet={handleEditPet}
        nombre={nombre}
        especieId={especieId}
        especieName={especie}
        speciesList={speciesList}
        f_nacimiento={edad}
        color={color}
        raza={raza}
      />
    </Container>
  );
};

export default Pet;
