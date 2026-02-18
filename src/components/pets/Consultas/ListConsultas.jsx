import React, { useState, useEffect } from "react";
import moment from "moment";
import "moment/locale/es";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { FaPaperclip } from "react-icons/fa";
import AddConsulta from "./AddConsulta";
import {
  newConsult,
  editProcedure,
  deleteConsult,
} from "../../../services/pets";
import { downloadProcedureReport } from "../../../services/reports";
import ReportFormatModal from "../../reports/ReportFormatModal";
import ProcedureAttachmentsModal from "../../attachments/ProcedureAttachmentsModal";

const ListConsultas = (props) => {
  const { embeddedInTabs } = props;
  const [consultas, setConsultas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [consultaEnEdicion, setConsultaEnEdicion] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [attachmentsTarget, setAttachmentsTarget] = useState(null);

  useEffect(() => setConsultas(props.consultas), [props]);

  const handleAddClick = () => {
    setConsultaEnEdicion(null);
    setShowModal(true);
  };

  const handleCloseAddClick = () => {
    setShowModal(false);
    setConsultaEnEdicion(null);
  };

  async function handelAddConsulta(symptoms, diagnosis, notes, performedAt) {
    await newConsult(
      props.token,
      symptoms,
      diagnosis,
      notes,
      performedAt,
      props.idPet
    ).then((res) => {
      const data = res.data;
      setConsultas((prev) => [...prev, data]);
      handleCloseAddClick();
    });
  }

  async function handelEditConsulta(procedureId, symptoms, diagnosis, notes, performedAt) {
    const body = {
      symptoms,
      diagnosis,
      notes,
      performedAt,
      type: "CONSULT",
    };
    await editProcedure(props.token, props.idPet, procedureId, body).then(
      (res) => {
        const updated = res.data;
        setConsultas((prev) =>
          prev.map((c) =>
            (c.id ?? c._id) === procedureId ? { ...c, ...updated } : c
          )
        );
        handleCloseAddClick();
      }
    );
  }

  const handleDeleteConsulta = async (idConsulta) => {
    await deleteConsult(props.token, props.idPet, idConsulta).then((res) => {
      setConsultas((prev) =>
        prev.filter((item) => (item.id ?? item._id) !== idConsulta)
      );
    });
  };

  const handleEdditConsulta = (item) => {
    setConsultaEnEdicion(item);
    setShowModal(true);
  };

  const content = (
    <>
      <div className="procedure-card-header">
        <h5>Consultas</h5>
        <Button
          className="btn-sisvet-primary btn-add-procedure"
          onClick={handleAddClick}
        >
          <i className="far fa-plus-square" aria-hidden="true"></i>
          Agregar consulta
        </Button>
      </div>
      {consultas.length > 0 ? (
        <div className="table-responsive">
          <Table striped hover className="table-sisvet-procedure">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Diagnóstico</th>
                <th style={{ width: "150px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {consultas.map((item, index) => (
                <tr key={item.id ?? item._id ?? `consult-${index}`}>
                  <td>{moment(item.performedAt ?? item.fecha).format("L")}</td>
                  <td className={!(item.diagnosis ?? item.diagnostico) ? "cell-empty" : ""}>
                    {(item.diagnosis ?? item.diagnostico) || "—"}
                  </td>
                  <td className="procedure-actions">
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => setAttachmentsTarget(item)}
                      title="Adjuntos"
                      aria-label="Adjuntos"
                    >
                      <FaPaperclip />
                    </button>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => {
                          setReportTarget(item);
                          setShowReportModal(true);
                        }}
                        title="Descargar informe"
                        aria-label="Descargar informe"
                      >
                        <i className="far fa-file-alt" />
                      </button>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => handleEdditConsulta(item)}
                        title="Editar"
                        aria-label="Editar consulta"
                      >
                        <i className="far fa-edit"></i>
                      </button>
                      <button
                        type="button"
                        className="btn-icon btn-icon-danger"
                        onClick={() => handleDeleteConsulta(item.id ?? item._id)}
                        title="Eliminar"
                        aria-label="Eliminar consulta"
                      >
                        <i className="far fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
              ))}
            </tbody>
            </Table>
        </div>
      ) : (
        <p className="procedure-empty mb-0">No hay consultas cargadas.</p>
      )}
    </>
  );

  return (
    <>
      {embeddedInTabs ? content : (
        <Card className="card-sisvet card-procedure h-100">
          <Card.Body>{content}</Card.Body>
        </Card>
      )}
      <AddConsulta
        show={showModal}
        handleCloseAddClick={handleCloseAddClick}
        handelAddConsulta={handelAddConsulta}
        handelEditConsulta={handelEditConsulta}
        consultaToEdit={consultaEnEdicion}
      />
      <ReportFormatModal
        show={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          setReportTarget(null);
        }}
        onSelect={(format) =>
          reportTarget
            ? downloadProcedureReport(props.idPet, reportTarget.id ?? reportTarget._id, format)
            : Promise.resolve()
        }
        title="Descargar informe de consulta"
      />
      <ProcedureAttachmentsModal
        show={attachmentsTarget != null}
        onClose={() => setAttachmentsTarget(null)}
        petId={props.idPet}
        procedureId={attachmentsTarget?.id ?? attachmentsTarget?._id}
        procedureLabel={
          attachmentsTarget
            ? `Consulta ${moment(attachmentsTarget.performedAt ?? attachmentsTarget.fecha).format("L")}`
            : "Consulta"
        }
      />
    </>
  );
};

export default ListConsultas;
