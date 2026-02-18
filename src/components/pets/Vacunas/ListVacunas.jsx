import React, { useEffect, useState } from "react";
import { Table, Button, Card } from "react-bootstrap";
import { FaPaperclip } from "react-icons/fa";
import moment from "moment";
import "moment/locale/es";
import AddVacuna from "./AddVacuna";
import {
  newVacuna,
  editProcedure,
  deleteVacuna,
} from "../../../services/pets";
import { downloadProcedureReport } from "../../../services/reports";
import ReportFormatModal from "../../reports/ReportFormatModal";
import ProcedureAttachmentsModal from "../../attachments/ProcedureAttachmentsModal";

const ListVacunas = (props) => {
  const { embeddedInTabs } = props;
  const [vacunas, setVacunas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [vacunaEnEdicion, setVacunaEnEdicion] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [attachmentsTarget, setAttachmentsTarget] = useState(null);

  useEffect(() => setVacunas(props.vacunas), [props]);

  const handleAddClick = () => {
    setVacunaEnEdicion(null);
    setShowModal(true);
  };

  const handleCloseAddClick = () => {
    setShowModal(false);
    setVacunaEnEdicion(null);
  };

  const handelAddVacuna = async (payload) => {
    await newVacuna(props.token, props.idPet, payload).then((res) => {
      const data = res.data;
      setVacunas((prev) => [...prev, data]);
      handleCloseAddClick();
    });
  };

  const handelEditVacuna = async (procedureId, payload) => {
    const body = { ...payload, type: "VACCINE" };
    await editProcedure(props.token, props.idPet, procedureId, body).then(
      (res) => {
        const updated = res.data;
        setVacunas((prev) =>
          prev.map((v) =>
            (v.id ?? v._id) === procedureId ? { ...v, ...updated } : v
          )
        );
        handleCloseAddClick();
      }
    );
  };

  const handleDeleteVacuna = async (idVacuna) => {
    await deleteVacuna(props.token, props.idPet, idVacuna).then(() => {
      setVacunas((prev) =>
        prev.filter((item) => (item.id ?? item._id) !== idVacuna)
      );
    });
  };

  const handleEdditVacuna = (item) => {
    setVacunaEnEdicion(item);
    setShowModal(true);
  };

  const content = (
    <>
      <div className="procedure-card-header">
        <h5>Vacunas</h5>
        <Button
          className="btn-sisvet-primary btn-add-procedure"
          onClick={handleAddClick}
        >
          <i className="far fa-plus-square" aria-hidden="true"></i>
          Agregar vacuna
        </Button>
      </div>
      {vacunas.length > 0 ? (
        <div className="table-responsive">
          <Table striped hover className="table-sisvet-procedure">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Vacuna</th>
                <th>Dosis</th>
                <th>Lote</th>
                <th>Próx. dosis</th>
                <th style={{ width: "150px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vacunas.map((item, index) => (
                <tr key={item.id ?? item._id ?? `vacuna-${index}`}>
                  <td>{moment(item.performedAt ?? item.fecha).format("L")}</td>
                  <td>{item.vaccineName ?? item.nombre}</td>
                  <td>{item.dose || "—"}</td>
                  <td>{item.lotNumber || "—"}</td>
                  <td>
                    {item.nextDoseAt || item.prox_aplicacion
                      ? moment(item.nextDoseAt ?? item.prox_aplicacion).format("L")
                      : "—"}
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
                          onClick={() => handleEdditVacuna(item)}
                          title="Editar"
                          aria-label="Editar vacuna"
                        >
                          <i className="far fa-edit"></i>
                        </button>
                        <button
                          type="button"
                          className="btn-icon btn-icon-danger"
                          onClick={() => handleDeleteVacuna(item.id ?? item._id)}
                          title="Eliminar"
                          aria-label="Eliminar vacuna"
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
        <p className="procedure-empty mb-0">No hay vacunas cargadas.</p>
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
      <AddVacuna
        show={showModal}
        handleCloseAddClick={handleCloseAddClick}
        handelAddVacuna={handelAddVacuna}
        handelEditVacuna={handelEditVacuna}
        vacunaToEdit={vacunaEnEdicion}
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
        title="Descargar informe de vacuna"
      />
      <ProcedureAttachmentsModal
        show={attachmentsTarget != null}
        onClose={() => setAttachmentsTarget(null)}
        petId={props.idPet}
        procedureId={attachmentsTarget?.id ?? attachmentsTarget?._id}
        procedureLabel={
          attachmentsTarget
            ? `Vacuna ${moment(attachmentsTarget.performedAt ?? attachmentsTarget.fecha).format("L")}`
            : "Vacuna"
        }
      />
    </>
  );
};

export default ListVacunas;
