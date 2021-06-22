// REACT
import React, { useState, useEffect } from "react";
// BOOTSTRAP
import Table from "react-bootstrap/table";
import Row from "react-bootstrap/row";
import Button from "react-bootstrap/button";
import Col from "react-bootstrap/col";
// MIOS
import AddConsulta from "./AddConsulta";
import newConsult from "../../services/pets/newConsult"

const ListConsultas = (props) => {

  const [consultas, setConsultas] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  useEffect(() => {
    setConsultas(props.consultas);
  }, [props]);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  async function handelAddConsulta(date, consulta, tratamiento, diagnostico) {
    await newConsult(props.token, date, consulta, tratamiento, diagnostico, props.idPet).then(res => {
      console.log(res)
    })
  };

  return (
    <>
      <div>
        <Row>
          <h4 className="col-8">Consultas</h4>
          <Col className="text-right">
            <Button className="add" onClick={handleLoginClick}>
              <i className="far fa-plus-square"></i>
            </Button>
          </Col>
        </Row>
        {consultas.length > 0 ? (
          <Table striped bordered hover size="sm" className="mt-2">
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
                  <td>{item.fecha}</td>
                  <td>{item.diagnostico}</td>
                  <td>
                    <i className="far fa-edit"></i>
                  </td>
                  <td>
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
      <AddConsulta show={showLoginModal}
        handleCloseLoginModal={handleCloseLoginModal} handelAddConsulta={handelAddConsulta} />
    </>
  );
};

export default ListConsultas;
