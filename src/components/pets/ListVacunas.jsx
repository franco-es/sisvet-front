import React, { useEffect, useState } from "react";
import { Row, Col, Table, Button } from "react-bootstrap";
import moment from "moment";
import "moment/locale/es";
import AddVacuna from "./AddVacuna";
import newVacuna from "../../services/pets/newVacuna";
import deleteVacuna from "../../services/pets/delete/deleteVacuna";

const ListVacunas = (props) => {
  const [vacunas, setVacunas] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => setVacunas(props.vacunas), [props]);

  const handleAddClick = () => {
    setShowLoginModal(true);
  };
  const handleCloseAddClick = () => {
    setShowLoginModal(false);
  };

  const handelAddVacuna = async (date, vacuna, nextDate) => {
    console.log(date + vacuna + nextDate);
    await newVacuna(props.token, date, vacuna, nextDate, props.idPet).then(
      (res) => {
        const response = res.data.Vacuna.vacunas;
        const data = response[response.length - 1];
        setVacunas([...vacunas, { ...data }]);
        handleCloseAddClick();
      }
    );
  };

  const handleDeleteVacuna = async (idVacuna) => {
    await deleteVacuna(props.token, props.idPet, idVacuna).then((res) => {
      const arrayFiltrado = vacunas.filter((item) => item._id !== idVacuna);
      setVacunas(arrayFiltrado);
    });
  };

  return (
    <>
      <div>
        <Row>
          <h4 className="col-8">Vacunas</h4>
          <Col className="text-right">
            <Button className="add" onClick={handleAddClick}>
              <i className="far fa-plus-square"></i>
            </Button>
          </Col>
        </Row>
        {vacunas.length > 0 ? (
          <Table striped bordered hover size="sm" className="mt-2">
            <thead>
              <tr>
                <th></th>
                <th>Fecha</th>
                <th>Vacuna</th>
                <th>Proxima</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {vacunas.map((item) => (
                <tr key={item._id}>
                  <td></td>
                  <td>{moment(item.fecha).format("L")}</td>
                  <td>{item.nombre}</td>
                  <td>{moment(item.prox_aplicacion).format("L")}</td>
                  <td>
                    <i className="far fa-edit"></i>
                  </td>
                  <td onClick={(e) => handleDeleteVacuna(item._id)}>
                    <i className="far fa-trash-alt"></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <h2>No hay vacunas nuevas</h2>
        )}
      </div>
      <AddVacuna
        show={showLoginModal}
        handleCloseAddClick={handleCloseAddClick}
        handelAddVacuna={handelAddVacuna}
      />
    </>
  );
};

export default ListVacunas;
