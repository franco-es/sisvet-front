// LIBRERIAS REQUERIDAS
import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/card";
// IMPORTACIONES PROPIAS
import UniquePet from "../../services/pets/uniquePet";

const Pet = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState("");
  const [especie, setEspecie] = useState(localStorage.getItem("token"));
  const [raza, setRaza] = useState(localStorage.getItem("token"));
  const { id } = useParams();
  useEffect(() => {
    Uniquepet();
  }, []);
  const Uniquepet = async () => {
    await UniquePet(token, id).then((res) => {
      const data = res.data.pet;
      setNombre(data.nombre);
      setColor(data.color);
      setEspecie(data.especie);
      setRaza(data.raza);
    });
  };
  return (
    <div className="row">
      <div className="col-6">
        <Card>
          <Card.Body>
            <Card.Title>{nombre}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{especie}</Card.Subtitle>
            <Card.Text>
              <ul>
                <li>pelaje: {color}</li>
                <li>raza: {raza}</li>
              </ul>
            </Card.Text>
            <Card.Link href="#">Card Link</Card.Link>
            <Card.Link href="#">Another Link</Card.Link>
          </Card.Body>
        </Card>
        s
      </div>
    </div>
  );
};

export default Pet;
