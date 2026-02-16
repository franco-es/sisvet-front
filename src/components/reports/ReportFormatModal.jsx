import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

/**
 * Modal para elegir formato de informe (PDF / Excel).
 * onSelect(format) con format = "pdf" | "excel". Se cierra al elegir.
 */
const ReportFormatModal = ({ show, onClose, onSelect, title = "Descargar informe" }) => {
  const [loading, setLoading] = useState(false);

  const handleSelect = async (format) => {
    if (!onSelect) return;
    setLoading(true);
    try {
      await onSelect(format);
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} className="modal-sisvet" centered>
      <Modal.Header closeButton className="bg-sisvet-platino border-0 pb-0">
        <Modal.Title className="text-sisvet-cobalto fw-bold">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3">
        <p className="text-muted small mb-3">Elegí el formato de descarga:</p>
        <div className="d-flex gap-2 flex-wrap">
          <Button
            className="btn-sisvet-outline-cobalto"
            onClick={() => handleSelect("pdf")}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-1" aria-hidden="true" />
            ) : (
              <i className="far fa-file-pdf me-1" />
            )}
            PDF
          </Button>
          <Button
            className="btn-sisvet-outline-cobalto"
            onClick={() => handleSelect("excel")}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-1" aria-hidden="true" />
            ) : (
              <i className="far fa-file-excel me-1" />
            )}
            Excel
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-sisvet-platino border-0 pt-0">
        <Button variant="link" className="text-sisvet-cobalto" onClick={onClose}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportFormatModal;
