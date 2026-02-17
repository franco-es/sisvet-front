import React, { useState, useEffect, useRef } from "react";
import { Card, Form, Button, Modal } from "react-bootstrap";
import { getArcaConfig, updateArcaConfigUpload, generateCsr } from "../../services/arcaConfig";

const INIT_FORM = {
  cuit: "",
  environment: "dev",
  puntoVenta: "",
  cbteTipo: "6",
  enabled: true,
};

const CBTE_TIPOS = [
  { value: 1, label: "1 - Factura A" },
  { value: 6, label: "6 - Factura B (consumidor final)" },
  { value: 11, label: "11 - Factura C" },
];

const AdminArcaConfig = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(INIT_FORM);
  const [certFile, setCertFile] = useState(null);
  const [keyFile, setKeyFile] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const certInputRef = useRef(null);
  const keyInputRef = useRef(null);
  const [showCsrModal, setShowCsrModal] = useState(false);
  const [csrLoading, setCsrLoading] = useState(false);
  const [csrError, setCsrError] = useState("");
  const [csrResult, setCsrResult] = useState(null);
  const [csrForm, setCsrForm] = useState({ cuit: "", organizationName: "", commonName: "Sisvet" });

  const load = () => {
    setLoading(true);
    setError("");
    getArcaConfig()
      .then((c) => {
        setConfig(c);
        if (c) {
          setForm((prev) => ({
            ...prev,
            cuit: c.cuit ?? "",
            environment: c.environment === "prod" ? "prod" : "dev",
            puntoVenta: c.puntoVenta != null ? String(c.puntoVenta) : "",
            cbteTipo: c.cbteTipo != null ? String(c.cbteTipo) : "6",
            enabled: c.enabled !== false,
          }));
        } else {
          setForm(INIT_FORM);
        }
      })
      .catch(() => {
        setConfig(null);
        setForm(INIT_FORM);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const cuit = form.cuit.trim().replace(/\D/g, "");
    if (cuit.length !== 11) {
      setError("El CUIT debe tener 11 dígitos.");
      return;
    }
    const hasCert = certFile != null;
    const hasKey = keyFile != null;
    if (!config?.configured && (!hasCert || !hasKey)) {
      setError("Para configurar por primera vez son obligatorios el certificado (.crt/.pem) y la clave privada (.key/.pem).");
      return;
    }
    setSaveLoading(true);
    try {
      const formData = new FormData();
      if (hasCert) formData.append("certificate", certFile);
      if (hasKey) formData.append("privateKey", keyFile);
      formData.append("cuit", cuit);
      formData.append("environment", form.environment);
      if (form.puntoVenta) formData.append("puntoVenta", form.puntoVenta);
      if (form.cbteTipo) formData.append("cbteTipo", form.cbteTipo);
      formData.append("enabled", form.enabled ? "true" : "false");
      await updateArcaConfigUpload(formData);
      setSuccess("Configuración ARCA guardada correctamente.");
      setCertFile(null);
      setKeyFile(null);
      if (certInputRef.current) certInputRef.current.value = "";
      if (keyInputRef.current) keyInputRef.current.value = "";
      load();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Error al guardar la configuración.";
      setError(msg);
    } finally {
      setSaveLoading(false);
    }
  };

  const update = (key, value) =>
    setForm((f) => ({ ...f, [key]: value }));

  const openCsrModal = () => {
    setCsrResult(null);
    setCsrError("");
    setCsrForm((prev) => ({ ...prev, cuit: form.cuit || prev.cuit }));
    setShowCsrModal(true);
  };

  const handleGenerateCsr = async (e) => {
    e?.preventDefault();
    setCsrError("");
    const cuit = (csrForm.cuit || form.cuit).trim().replace(/\D/g, "");
    if (cuit.length !== 11) {
      setCsrError("El CUIT debe tener 11 dígitos.");
      return;
    }
    setCsrLoading(true);
    try {
      const body = {
        cuit: cuit.replace(/(\d{2})(\d{8})(\d{1})/, "$1-$2-$3"),
        organizationName: csrForm.organizationName.trim() || undefined,
        commonName: csrForm.commonName.trim() || undefined,
      };
      const data = await generateCsr(body);
      setCsrResult({ csrPem: data.csrPem, privateKeyPem: data.privateKeyPem });
    } catch (err) {
      setCsrResult(null);
      setCsrError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Error al generar CSR."
      );
    } finally {
      setCsrLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text).then(() => {}, () => {});
  };

  const downloadPem = (content, filename) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card className="card-sisvet h-100">
        <Card.Header className="bg-sisvet-cobalto text-white">
          Facturación electrónica (ARCA / AFIP)
        </Card.Header>
        <Card.Body>
          <p className="mb-0">Cargando configuración...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="card-sisvet h-100">
      <Card.Header className="bg-sisvet-cobalto text-white d-flex justify-content-between align-items-center flex-wrap gap-2">
        <span>Facturación electrónica (ARCA / AFIP)</span>
        <div className="d-flex align-items-center gap-2">
          <Button
            variant="light"
            size="sm"
            className="text-sisvet-cobalto"
            onClick={openCsrModal}
          >
            <i className="fas fa-certificate me-1" aria-hidden="true" />
            Generar CSR
          </Button>
          {config?.configured ? (
            <span className="badge bg-success">Configurado</span>
          ) : (
            <span className="badge bg-secondary">No configurado</span>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        <p className="text-muted small mb-3">
          Integración directa con AFIP (WSAA + WSFE). Subí el certificado (.crt/.pem) y la clave privada (.key/.pem) emitidos por AFIP. Si ya está configurado, dejá los archivos vacíos para no cambiarlos.
        </p>
        <Form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger py-2 small mb-3">{error}</div>
          )}
          {success && (
            <div className="alert alert-success py-2 small mb-3">{success}</div>
          )}
          <Form.Group className="mb-3">
            <Form.Label>CUIT (11 dígitos)</Form.Label>
            <Form.Control
              type="text"
              value={form.cuit}
              onChange={(e) => update("cuit", e.target.value)}
              placeholder="20123456789"
              maxLength={13}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Certificado (.crt, .pem)</Form.Label>
            <Form.Control
              ref={certInputRef}
              type="file"
              accept=".crt,.pem,.cer"
              onChange={(e) => setCertFile(e.target.files?.[0] ?? null)}
            />
            {certFile && (
              <Form.Text className="d-block text-muted small mt-1">
                {certFile.name}
              </Form.Text>
            )}
            <Form.Text className="text-muted">
              Archivo X.509 en PEM (-----BEGIN CERTIFICATE-----). Dejalo vacío para no cambiar.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Clave privada (.key, .pem)</Form.Label>
            <Form.Control
              ref={keyInputRef}
              type="file"
              accept=".key,.pem"
              onChange={(e) => setKeyFile(e.target.files?.[0] ?? null)}
            />
            {keyFile && (
              <Form.Text className="d-block text-muted small mt-1">
                {keyFile.name}
              </Form.Text>
            )}
            <Form.Text className="text-muted">
              Archivo PEM (RSA o PKCS#8). Dejalo vacío para no cambiar.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ambiente</Form.Label>
            <Form.Select
              value={form.environment}
              onChange={(e) => update("environment", e.target.value)}
            >
              <option value="dev">Desarrollo (homologación)</option>
              <option value="prod">Producción</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Punto de venta</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={form.puntoVenta}
              onChange={(e) => update("puntoVenta", e.target.value)}
              placeholder="1"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo de comprobante</Form.Label>
            <Form.Select
              value={form.cbteTipo}
              onChange={(e) => update("cbteTipo", e.target.value)}
            >
              {CBTE_TIPOS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="arca-enabled"
              label="Habilitar facturación electrónica"
              checked={form.enabled}
              onChange={(e) => update("enabled", e.target.checked)}
            />
          </Form.Group>
          <Button
            type="submit"
            className="btn-sisvet-primary"
            disabled={saveLoading}
          >
            {saveLoading ? "Guardando..." : "Guardar configuración"}
          </Button>
        </Form>
      </Card.Body>

      <Modal show={showCsrModal} onHide={() => setShowCsrModal(false)} className="modal-sisvet" size="lg">
        <Modal.Header closeButton className="bg-sisvet-platino border-0 pb-0">
          <Modal.Title className="text-sisvet-cobalto fw-bold">
            Generar certificado CSR y clave privada
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          {!csrResult ? (
            <Form onSubmit={handleGenerateCsr}>
              {csrError && (
                <div className="alert alert-danger py-2 small mb-3">{csrError}</div>
              )}
              <p className="text-muted small mb-3">
                Se generará un CSR (PKCS#10) y una clave privada RSA 2048 para presentar en ARCA/AFIP. Guardá la clave privada; la vas a necesitar al subir el certificado que te emita ARCA.
              </p>
              <Form.Group className="mb-3">
                <Form.Label>CUIT (11 dígitos)</Form.Label>
                <Form.Control
                  type="text"
                  value={csrForm.cuit}
                  onChange={(e) => setCsrForm((f) => ({ ...f, cuit: e.target.value }))}
                  placeholder="20123456789"
                  maxLength={13}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Razón social / Organización (opcional)</Form.Label>
                <Form.Control
                  type="text"
                  value={csrForm.organizationName}
                  onChange={(e) => setCsrForm((f) => ({ ...f, organizationName: e.target.value }))}
                  placeholder="Mi Veterinaria S.A."
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nombre común (opcional)</Form.Label>
                <Form.Control
                  type="text"
                  value={csrForm.commonName}
                  onChange={(e) => setCsrForm((f) => ({ ...f, commonName: e.target.value }))}
                  placeholder="Sisvet"
                />
              </Form.Group>
              <div className="d-flex gap-2">
                <Button type="submit" className="btn-sisvet-primary" disabled={csrLoading}>
                  {csrLoading ? "Generando..." : "Generar CSR y clave privada"}
                </Button>
                <Button variant="secondary" onClick={() => setShowCsrModal(false)}>
                  Cancelar
                </Button>
              </div>
            </Form>
          ) : (
            <>
              <div className="alert alert-warning py-2 small mb-3">
                <strong>Importante:</strong> Guardá la clave privada en un lugar seguro. No se vuelve a mostrar. Cuando ARCA te entregue el certificado (.crt), subilo en esta pantalla junto con esta clave privada.
              </div>
              <Form.Group className="mb-3">
                <Form.Label>CSR (solicitud de certificado)</Form.Label>
                <div className="d-flex gap-2 mb-1">
                  <Button size="sm" variant="outline-secondary" onClick={() => copyToClipboard(csrResult.csrPem)}>
                    Copiar
                  </Button>
                  <Button size="sm" variant="outline-secondary" onClick={() => downloadPem(csrResult.csrPem, "solicitud.csr")}>
                    Descargar .csr
                  </Button>
                </div>
                <Form.Control as="textarea" rows={5} value={csrResult.csrPem} readOnly className="font-monospace small" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Clave privada PEM</Form.Label>
                <div className="d-flex gap-2 mb-1">
                  <Button size="sm" variant="outline-secondary" onClick={() => copyToClipboard(csrResult.privateKeyPem)}>
                    Copiar
                  </Button>
                  <Button size="sm" variant="outline-secondary" onClick={() => downloadPem(csrResult.privateKeyPem, "clave-privada.key")}>
                    Descargar .key
                  </Button>
                </div>
                <Form.Control as="textarea" rows={5} value={csrResult.privateKeyPem} readOnly className="font-monospace small" />
              </Form.Group>
              <Button variant="secondary" onClick={() => setShowCsrModal(false)}>
                Cerrar
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default AdminArcaConfig;
