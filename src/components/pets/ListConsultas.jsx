import React, { useState, useEffect } from "react";
import AddConsulta from "./AddConsulta";
import Table from "react-bootstrap/table";
import Row from "react-bootstrap/row";
import Col from "react-bootstrap/col";

const ListConsultas = (props) => {
  const [consultas, setConsultas] = useState([]);
  useEffect(() => {
    setConsultas(props.consultas);
  }, [props]);

  const addNew = () => {
    console.log("add NEW Consulta");
  };

  return (
    <div>
      <Row>
        <h4 className="col-8">Consultas</h4>
        <Col className="text-right">
          <AddConsulta add={addNew} />
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
  );
};

export default ListConsultas;
