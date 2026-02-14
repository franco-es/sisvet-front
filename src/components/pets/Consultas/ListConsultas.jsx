// REACT
import React, { useState, useEffect } from "react";
import moment from "moment";
import "moment/locale/es";
// BOOTSTRAP (PascalCase: Linux/Docker es case-sensitive)
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
// MIOS
import AddConsulta from "./AddConsulta";
import newConsult from "../../../services/pets/newConsult";
import deleteConsult from "../../../services/pets/delete/deleteConsulta";

const ListConsultas = (props) => {
  const [consultas, setConsultas] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => setConsultas(props.consultas), [props]);

  const
    handleAddClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseAddClick = () => {
    setShowLoginModal(false);
  };

  async function handelAddConsulta(date, consulta, tratamiento, diagnostico) {
    await newConsult(
      props.token,
      date,
      consulta,
      tratamiento,
      diagnostico,
      props.idPet
    ).then((res) => {
      const response = res.data.consultas;
      const data = response[response.length - 1];

      setConsultas([...consultas, { ...data }]);
      handleCloseAddClick();
    });
  }

  const handleDeleteConsulta = async (idConsulta) => {
    await deleteConsult(props.token, props.idPet, idConsulta).then((res) => {
      const arrayFiltrado = consultas.filter((item) => item._id !== idConsulta);
      setConsultas(arrayFiltrado);
    });
  };

  async function handleEdditConsulta(date, consulta, tratamiento, diagnostico) {

  }

  return (
    <>
      <div>
        <Row>
          <h4 className="col-8">Consultas</h4>
          <Col className="text-right">
            <Button className="add" onClick={handleAddClick}>
              <i className="far fa-plus-square"></i>
            </Button>
          </Col>
        </Row>
        {consultas.length > 0 ? (
          <Table striped hover size="lg" className="mt-2">
            <thead>
              <tr>
                <th></th>
                <th>Fecha</th>
                <th>Diagnostico</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {consultas.map((item) => (
                <tr key={item._id}>
                  <td></td>
                  <td>{moment(item.fecha).format("L")}</td>
                  <td>{item.diagnostico}</td>
                  <td
                    className="text-content-center"
                    onClick={(e) => handleEdditConsulta(item._id)}
                  >
                    <i className="far fa-edit"></i>
                  </td>
                  <td
                    className="text-content-center"
                    onClick={(e) => handleDeleteConsulta(item._id)}
                  >
                    <i className="far fa-trash-alt"></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <h2>No hay consultas nuevas</h2>
        )}
      </div>
      <AddConsulta
        show={showLoginModal}
        handleCloseAddClick={handleCloseAddClick}
        handelAddConsulta={handelAddConsulta}
      />
    </>
  );
};

export default ListConsultas;
