import React, { useEffect, useState } from "react";
import { Row, Col, Table, Button } from "react-bootstrap";
import moment from "moment";
import "moment/locale/es";

import AddCirugia from "./AddCirugia";
import newCirugia from "../../../services/pets/newCirugia";
import deleteCirugia from "../../../services/pets/delete/deleteCirugia";

const ListCirugias = (props) => {
  const [cirugias, setCirugias] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => setCirugias(props.cirugias), [props]);

  const handleAddClick = () => {
    setShowLoginModal(true);
  };
  const handleCloseAddClick = () => {
    setShowLoginModal(false);
  };

  const handelAddCirugia = async (date, contenido) => {
    console.log(date + " " + contenido);
    await newCirugia(props.token, date, contenido, props.idPet).then((res) => {
      const response = res.data.Cirugia.cirugia;
      const data = response[response.length - 1];
      setCirugias([...cirugias, { ...data }]);
      handleCloseAddClick();
    });
  };
  const handledeleteCirugia = async (idCirugia) => {
    await deleteCirugia(props.token, props.idPet, idCirugia).then((res) => {
      const arrayFiltrado = cirugias.filter((item) => item._id !== idCirugia);
      setCirugias(arrayFiltrado);
    });
  };

  return (
    <>
      <div>
        <Row>
          <h4 className="col-8">Cirugias</h4>
          <Col className="text-right">
            <Button className="add" onClick={handleAddClick}>
              <i className="far fa-plus-square"></i>
            </Button>
          </Col>
        </Row>
        {cirugias.length > 0 ? (
          <Table striped bordered hover size="sm" className="mt-2">
            <thead>
              <tr>
                <th></th>
                <th>Fecha</th>
                <th>Cirugia</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cirugias.map((item) => (
                <tr key={item._id}>
                  <td></td>
                  <td>{moment(item.fecha).format("L")}</td>
                  <td>{item.contenido}</td>
                  <td>
                    <i className="far fa-edit"></i>
                  </td>
                  <td onClick={(e) => handledeleteCirugia(item._id)}>
                    <i className="far fa-trash-alt"></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <h2>No hay cirugias nuevas</h2>
        )}
      </div>
      <AddCirugia
        show={showLoginModal}
        handleCloseAddClick={handleCloseAddClick}
        handelAddCirugia={handelAddCirugia}
      />
    </>
  );
};

export default ListCirugias;
