import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import {
  listAttachments,
  uploadAttachment,
  downloadAttachment,
  deleteAttachment,
  MAX_FILE_SIZE,
  ACCEPT_TYPES,
} from "../../services/attachments";
import VoiceToTextField from "../transcription/VoiceToTextField";

const formatSize = (bytes) => {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ProcedureAttachmentsModal = ({
  show,
  onClose,
  petId,
  procedureId,
  procedureLabel = "Procedimiento",
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");

  const load = useCallback(async () => {
    if (!petId || !procedureId) return;
    setLoading(true);
    setError(null);
    try {
      const list = await listAttachments(petId, procedureId);
      setItems(list);
    } catch (e) {
      setError("No se pudieron cargar los adjuntos.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [petId, procedureId]);

  useEffect(() => {
    if (show && petId && procedureId) load();
  }, [show, petId, procedureId, load]);

  const handleUpload = async (e) => {
    e?.preventDefault();
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError("El archivo no puede superar 10 MB.");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      await uploadAttachment(petId, procedureId, file, description.trim());
      setFile(null);
      setDescription("");
      if (document.getElementById("attachments-file-input")) {
        document.getElementById("attachments-file-input").value = "";
      }
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Error al subir el archivo.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (att) => {
    downloadAttachment(petId, procedureId, att.id, att.fileName).catch(() => {
      setError("Error al descargar.");
    });
  };

  const handleDelete = async (att) => {
    if (!window.confirm(`¿Eliminar "${att.fileName}"?`)) return;
    try {
      await deleteAttachment(petId, procedureId, att.id);
      load();
    } catch {
      setError("Error al eliminar.");
    }
  };

  if (!show) return null;

  return (
    <Modal show={show} onHide={onClose} className="modal-sisvet" size="lg">
      <Modal.Header closeButton className="bg-sisvet-platino border-0 pb-0">
        <Modal.Title className="text-sisvet-cobalto fw-bold">
          Adjuntos — {procedureLabel}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3">
        {error && (
          <div className="alert alert-warning py-2 small mb-4" role="alert">
            {error}
          </div>
        )}

        <Form onSubmit={handleUpload} className="attachments-upload-form mb-4">
          <Form.Group className="mb-4">
            <Form.Label className="small">Archivo (máx. 10 MB)</Form.Label>
            <Form.Control
              id="attachments-file-input"
              type="file"
              accept={ACCEPT_TYPES}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="form-control"
            />
          </Form.Group>
          <VoiceToTextField
            label="Descripción (opcional)"
            value={description}
            onChange={setDescription}
            placeholder="Ej. Radiografía, análisis de sangre"
            as="input"
            className="mb-4"
          />
          <Button
            type="submit"
            className="btn-sisvet-primary"
            disabled={!file || uploading}
          >
            {uploading ? "Subiendo…" : "Subir"}
          </Button>
        </Form>

        {loading ? (
          <p className="text-muted small mb-0">Cargando adjuntos…</p>
        ) : items.length === 0 ? (
          <p className="text-muted small mb-0">No hay adjuntos.</p>
        ) : (
          <Table size="sm" striped className="table-sisvet-procedure mb-0 mt-2">
            <thead>
              <tr>
                <th>Archivo</th>
                <th>Tamaño</th>
                <th>Fecha</th>
                <th>Descripción</th>
                <th style={{ width: "100px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((att) => (
                <tr key={att.id}>
                  <td>{att.fileName || "—"}</td>
                  <td>{formatSize(att.fileSize)}</td>
                  <td>
                    {att.uploadedAt
                      ? new Date(att.uploadedAt).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className={!att.description ? "text-muted" : ""}>
                    {att.description || "—"}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-link p-0 text-sisvet-cobalto me-2"
                      onClick={() => handleDownload(att)}
                      title="Descargar"
                      aria-label="Descargar"
                    >
                      <i className="far fa-download" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-link p-0 text-danger"
                      onClick={() => handleDelete(att)}
                      title="Eliminar"
                      aria-label="Eliminar"
                    >
                      <i className="far fa-trash-alt" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer className="bg-sisvet-platino border-0 pt-0">
        <Button variant="link" className="text-sisvet-cobalto" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProcedureAttachmentsModal;
