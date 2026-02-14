import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const EditPet = (props) => {
  const [nombre, setNombre] = useState("");
  const [raza, setRaza] = useState("");
  const [color, setColor] = useState("");
  const [especieId, setEspecieId] = useState("");
  const [f_nacimiento, setF_Nacimiento] = useState("");
  const [error, setError] = useState(null);

  const { speciesList = [], especieId: propEspecieId, especieName } = props;

  useEffect(() => {
    if (!props.show) return;
    setNombre(props.nombre ?? "");
    setRaza(props.raza ?? "");
    setColor(props.color ?? "");
    setF_Nacimiento(props.f_nacimiento ?? "");
    const found = speciesList.find((s) => (s.name ?? s.nombre) === especieName);
    const resolvedId = propEspecieId ?? (found ? found.id ?? found._id : "");
    setEspecieId(resolvedId !== undefined && resolvedId !== null ? String(resolvedId) : "");
  }, [props.show, props.nombre, props.raza, props.color, props.f_nacimiento, propEspecieId, especieName, speciesList]);

  const verifyData = (e) => {
    e.preventDefault();
    setError(null);
    if (!nombre?.trim()) {
      setError("Por favor escriba el nombre de la mascota");
      return;
    }
    if (!raza?.trim()) {
      setError("Por favor escriba la raza de la mascota");
      return;
    }
    if (!color?.trim()) {
      setError("Por favor escriba el pelaje de la mascota");
      return;
    }
    if (!especieId) {
      setError("Por favor seleccione la especie");
      return;
    }
    props.handleEditPet(nombre, raza, color, especieId, f_nacimiento);
  };

  return (
    <Modal show={props.show} onHide={props.handleCloseAddClick} className="modal-sisvet">
      <Modal.Header closeButton className="text-center bg-sisvet-platino border-0 pb-0">
        <Modal.Title className="text-sisvet-cobalto">Editar Mascota</Modal.Title>
      </Modal.Header>
      <Form onSubmit={verifyData}>
        <Modal.Body className="modal-form-sisvet pt-3">
          {error && <div className="text-danger mb-2">{error}</div>}
          <Form.Group className="mb-2">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Raza</Form.Label>
            <Form.Control
              type="text"
              placeholder="Raza"
              value={raza}
              onChange={(e) => setRaza(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Especie</Form.Label>
            <Form.Select
              className="form-select"
              id="speciesSelect"
              value={especieId}
              onChange={(e) => setEspecieId(e.target.value)}
              disabled={!speciesList.length}
            >
              <option value="" disabled>Seleccione una especie</option>
              {speciesList.map((s) => {
                const sid = s.id ?? s._id;
                const label = s.name ?? s.nombre ?? sid;
                return (
                  <option key={sid} value={sid}>
                    {label}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Pelaje</Form.Label>
            <Form.Control
              type="text"
              placeholder="Pelaje"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Fecha de Nacimiento</Form.Label>
            <Form.Control
              type="date"
              value={f_nacimiento}
              onChange={(e) => setF_Nacimiento(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="bg-sisvet-platino">
          <Button
            type="button"
            className="btn-sisvet-outline-cobalto"
            onClick={props.handleCloseAddClick}
          >
            Cancelar
          </Button>
          <Button type="submit" className="btn-sisvet-primary">
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditPet;
