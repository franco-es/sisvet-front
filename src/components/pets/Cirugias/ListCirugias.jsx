import React, { useEffect, useState } from "react";
import { Table, Button, Card } from "react-bootstrap";
import { FaPaperclip } from "react-icons/fa";
import moment from "moment";
import "moment/locale/es";
import AddCirugia from "./AddCirugia";
import {
  newCirugia,
  editProcedure,
  deleteCirugia,
} from "../../../services/pets";
import { downloadProcedureReport } from "../../../services/reports";
import ReportFormatModal from "../../reports/ReportFormatModal";
import ProcedureAttachmentsModal from "../../attachments/ProcedureAttachmentsModal";

const ListCirugias = (props) => {
  const { embeddedInTabs } = props;
  const [cirugias, setCirugias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cirugiaEnEdicion, setCirugiaEnEdicion] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [attachmentsTarget, setAttachmentsTarget] = useState(null);

  useEffect(() => setCirugias(props.cirugias), [props]);

  const handleAddClick = () => {
    setCirugiaEnEdicion(null);
    setShowModal(true);
  };

  const handleCloseAddClick = () => {
    setShowModal(false);
    setCirugiaEnEdicion(null);
  };

  const handelAddCirugia = async (payload) => {
    await newCirugia(props.token, props.idPet, payload).then((res) => {
      const data = res.data;
      setCirugias((prev) => [...prev, data]);
      handleCloseAddClick();
    });
  };

  const handelEditCirugia = async (procedureId, payload) => {
    const body = { ...payload, type: "SURGERY" };
    await editProcedure(props.token, props.idPet, procedureId, body).then(
      (res) => {
        const updated = res.data;
        setCirugias((prev) =>
          prev.map((c) =>
            (c.id ?? c._id) === procedureId ? { ...c, ...updated } : c
          )
        );
        handleCloseAddClick();
      }
    );
  };

  const handleDeleteCirugia = async (idCirugia) => {
    await deleteCirugia(props.token, props.idPet, idCirugia).then(() => {
      setCirugias((prev) =>
        prev.filter((item) => (item.id ?? item._id) !== idCirugia)
      );
    });
  };

  const handleEdditCirugia = (item) => {
    setCirugiaEnEdicion(item);
    setShowModal(true);
  };

  const content = (
    <>
      <div className="procedure-card-header">
        <h5>Cirugías</h5>
        <Button
          className="btn-sisvet-primary btn-add-procedure"
          onClick={handleAddClick}
        >
          <i className="far fa-plus-square" aria-hidden="true"></i>
          Agregar cirugía
        </Button>
      </div>
      {cirugias.length > 0 ? (
        <div className="table-responsive">
          <Table striped hover className="table-sisvet-procedure">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Cirujano</th>
                <th>Anestesia</th>
                <th>Programada</th>
                <th>Exitosa</th>
                <th style={{ width: "150px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cirugias.map((item, index) => (
                <tr key={item.id ?? item._id ?? `cirugia-${index}`}>
                  <td>{moment(item.performedAt ?? item.fecha).format("L")}</td>
                  <td>{item.surgeryType ?? item.contenido}</td>
                  <td>{item.surgeon || "—"}</td>
                  <td>{item.anesthesiaType || "—"}</td>
                  <td>
                    {item.scheduledAt
                      ? moment(item.scheduledAt).format("L")
                      : "—"}
                  </td>
                  <td>{item.successful === false ? "No" : "Sí"}</td>
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
                          onClick={() => handleEdditCirugia(item)}
                          title="Editar"
                          aria-label="Editar cirugía"
                        >
                          <i className="far fa-edit"></i>
                        </button>
                        <button
                          type="button"
                          className="btn-icon btn-icon-danger"
                          onClick={() => handleDeleteCirugia(item.id ?? item._id)}
                          title="Eliminar"
                          aria-label="Eliminar cirugía"
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
        <p className="procedure-empty mb-0">No hay cirugías cargadas.</p>
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
      <AddCirugia
        show={showModal}
        handleCloseAddClick={handleCloseAddClick}
        handelAddCirugia={handelAddCirugia}
        handelEditCirugia={handelEditCirugia}
        cirugiaToEdit={cirugiaEnEdicion}
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
        title="Descargar informe de cirugía"
      />
      <ProcedureAttachmentsModal
        show={attachmentsTarget != null}
        onClose={() => setAttachmentsTarget(null)}
        petId={props.idPet}
        procedureId={attachmentsTarget?.id ?? attachmentsTarget?._id}
        procedureLabel={
          attachmentsTarget
            ? `Cirugía ${moment(attachmentsTarget.performedAt ?? attachmentsTarget.fecha).format("L")}`
            : "Cirugía"
        }
      />
    </>
  );
};

export default ListCirugias;
