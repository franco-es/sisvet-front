import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Row, Col, Card, Button, Nav, Tab } from "react-bootstrap";
import { FaCalendarPlus } from "react-icons/fa";
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
  const ageText = edad ? moment(edad, "YYYY-MM-DD").fromNow(true) : "—";

  return (
    <div className="container-fluid pet-detail-page">
      <div className="pet-detail-hero">
        <h1>{nombre || "—"}</h1>
        <p className="pet-detail-subtitle">Ficha de la mascota</p>
      </div>

      <Row className="g-3">
        <Col xs={12} md={6}>
          <Card className="pet-detail-card border-0">
            <Card.Body>
              <h2 className="pet-detail-name">{nombre || "—"}</h2>
              <div className="pet-detail-row">
                <span className="pet-detail-label">Especie</span>
                <span className="pet-detail-value">{especie || "—"}</span>
              </div>
              <div className="pet-detail-row">
                <span className="pet-detail-label">Pelaje</span>
                <span className="pet-detail-value">{color || "—"}</span>
              </div>
              <div className="pet-detail-row">
                <span className="pet-detail-label">Raza</span>
                <span className="pet-detail-value">{raza || "—"}</span>
              </div>
              <div className="pet-detail-row">
                <span className="pet-detail-label">Edad</span>
                <span className="pet-detail-value">{ageText}</span>
              </div>
              <div className="pet-detail-actions">
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
                  <FaCalendarPlus className="me-1" aria-hidden />
                  Agendar turno
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Owner owner={owner} cardClassName="pet-detail-card" />
        </Col>
      </Row>

      <div className="pet-detail-report-bar">
        <span className="pet-detail-report-label">Informe de procedimientos</span>
        <Button
          size="sm"
          className="btn-sisvet-outline-cobalto"
          onClick={() => downloadPetProceduresReport(id, "pdf")}
        >
          PDF
        </Button>
        <Button
          size="sm"
          className="btn-sisvet-outline-cobalto"
          onClick={() => downloadPetProceduresReport(id, "excel")}
        >
          Excel
        </Button>
      </div>

      <div className="pet-detail-procedures">
        <Card className="card-sisvet card-procedure pet-detail-procedures-card">
          <Card.Body className="pt-3">
            <Tab.Container defaultActiveKey="consultas">
              <Nav variant="tabs" className="pet-detail-procedures-nav">
                <Nav.Item>
                  <Nav.Link eventKey="consultas">Consultas</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="vacunas">Vacunas</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="cirugias">Cirugías</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content className="pet-detail-procedures-content">
                <Tab.Pane eventKey="consultas" mountOnEnter unmountOnExit>
                  <ListConsultas idPet={id} consultas={consultas} token={token} embeddedInTabs />
                </Tab.Pane>
                <Tab.Pane eventKey="vacunas" mountOnEnter unmountOnExit>
                  <ListVacunas idPet={id} vacunas={vacunas} token={token} embeddedInTabs />
                </Tab.Pane>
                <Tab.Pane eventKey="cirugias" mountOnEnter unmountOnExit>
                  <ListCirugias idPet={id} cirugias={cirugias} token={token} embeddedInTabs />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Card.Body>
        </Card>
      </div>
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
    </div>
  );
};

export default Pet;
