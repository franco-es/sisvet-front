import React, { useEffect, useState } from "react";
import { Row, Col, Table } from "react-bootstrap";
import AddVacuna from "./AddVacuna";

const ListVacunas = (props) => {
  const [vacunas, setVacunas] = useState([]);

  useEffect(() => setVacunas(props.vacunas), [props]);

  return (
    <div>
      <Row>
        <h4 className="col-8">Vacunas</h4>
        <Col className="text-right">
          <AddVacuna />
        </Col>
      </Row>
      {vacunas.length > 0 ? (
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
            {vacunas.map((item) => (
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
        <h2>No hay vacunas nuevas</h2>
      )}
    </div>
  );
};

export default ListVacunas;
