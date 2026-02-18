import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import AddEditOwner from "./AddEditOwner";
import { addOwnerAPI, editOwnerAPI, getOwner } from "../../services/owner";

const Owner = (props) => {
  const { cardClassName = "pet-detail-card" } = props;
  const [showOwnerModal, SetShowOwnerModal] = useState(false);
  const [token] = useState(localStorage.getItem("token"));
  const [isEdit, setIsEdit] = useState(false);

  const [owner, setOwner] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");

  const { id } = useParams();

  const handleGetOwner = useCallback(async () => {
    try {
      const res = await getOwner(token, id);
      const ownerData = res.data?.owner ?? res.data;
      if (!ownerData) {
        setOwner(false);
        return;
      }
      setOwner(true);
      setNombre(ownerData.firstName ?? ownerData.nombre ?? "");
      setApellido(ownerData.lastName ?? ownerData.apellido ?? "");
      setTelefono(ownerData.phone ?? ownerData.telefono ?? "");
      setDireccion(ownerData.address ?? ownerData.direccion ?? "");
      setEmail(ownerData.email ?? "");
    } catch {
      setOwner(false);
    }
  }, [token, id]);

  useEffect(() => {
    handleGetOwner();
  }, [handleGetOwner]);

  const showOwnerEditModalFunction = () => {
    setIsEdit(true);
    SetShowOwnerModal(true);
  };
  const showOwnerModalFunction = () => {
    setIsEdit(false);
    SetShowOwnerModal(true);
  };
  const hideOwnerModalFunction = () => {
    SetShowOwnerModal(false);
  };

  async function addOwner(nombre, apellido, telefono, direccion, email, type) {
    await addOwnerAPI(
      token,
      id,
      nombre,
      apellido,
      telefono,
      direccion,
      email,
      type
    ).then((res) => {
      console.log(res);
      var data = res;
      setOwner(true);
      setNombre(data.firstName);
      setApellido(data.lastName);
      setTelefono(data.phone);
      setDireccion(data.address);
      setEmail(data.email);
      SetShowOwnerModal(false);
    });
  }

  async function editOwner(nombre, apellido, telefono, direccion, email, type) {
    await editOwnerAPI(
      token,
      id,
      nombre,
      apellido,
      telefono,
      direccion,
      email,
      type
    ).then((res) => {
      var data = res.data;
      setNombre(data.firstName);
      setApellido(data.lastName);
      setTelefono(data.phone);
      setDireccion(data.address);
      setEmail(data.email);
      SetShowOwnerModal(false);
    });
  }
  return (
    <>
      <Card className={`${cardClassName} border-0`}>
        <Card.Body>
          <h2 className="pet-detail-card-title">Propietario</h2>
          {owner === true ? (
            <>
              <div className="pet-detail-row">
                <span className="pet-detail-label">Nombre</span>
                <span className="pet-detail-value">{nombre || "—"}</span>
              </div>
              <div className="pet-detail-row">
                <span className="pet-detail-label">Apellido</span>
                <span className="pet-detail-value">{apellido || "—"}</span>
              </div>
              <div className="pet-detail-row">
                <span className="pet-detail-label">Dirección</span>
                <span className="pet-detail-value">{direccion || "—"}</span>
              </div>
              <div className="pet-detail-row">
                <span className="pet-detail-label">Teléfono</span>
                <span className="pet-detail-value">{telefono || "—"}</span>
              </div>
              <div className="pet-detail-row">
                <span className="pet-detail-label">Email</span>
                <span className="pet-detail-value">{email || "—"}</span>
              </div>
              <div className="pet-detail-actions">
                <Button
                  className="btn-sisvet-outline-cobalto"
                  onClick={showOwnerEditModalFunction}
                >
                  Editar
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-muted mb-3">Aún no hay propietario asignado.</p>
              <Button
                className="btn-sisvet-primary"
                onClick={showOwnerModalFunction}
              >
                Agregar propietario
              </Button>
            </>
          )}
        </Card.Body>
      </Card>

      <AddEditOwner
        show={showOwnerModal}
        handleCloseAddClick={hideOwnerModalFunction}
        handleAddClick={addOwner}
        handleEditClick={editOwner}
        isEdit={isEdit}
        nombre={nombre}
        apellido={apellido}
        telefono={telefono}
        direccion={direccion}
        email={email}
        idPet={id}
      />
    </>
  );
};

export default Owner;
