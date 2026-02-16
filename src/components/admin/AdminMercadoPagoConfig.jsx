import React, { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import {
  getMercadoPagoStatus,
  getMercadoPagoConfig,
  updateMercadoPagoConfig,
} from "../../services/payments";

const INIT_FORM = {
  accessToken: "",
  backUrlSuccess: "",
  backUrlPending: "",
  backUrlFailure: "",
  notificationUrl: "",
};

const AdminMercadoPagoConfig = () => {
  const [mpStatus, setMpStatus] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(INIT_FORM);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    Promise.all([
      getMercadoPagoStatus().then((d) => setMpStatus(d)).catch(() => setMpStatus({ configured: false })),
      getMercadoPagoConfig()
        .then((c) => {
          setConfig(c);
          if (c) {
            setForm({
              accessToken: c.accessToken ?? "",
              backUrlSuccess: c.backUrlSuccess ?? "",
              backUrlPending: c.backUrlPending ?? "",
              backUrlFailure: c.backUrlFailure ?? "",
              notificationUrl: c.notificationUrl ?? "",
            });
          } else {
            setForm(INIT_FORM);
          }
        })
        .catch(() => {
          setConfig(null);
          setForm(INIT_FORM);
        }),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.accessToken.trim()) {
      setError("El Access Token es obligatorio.");
      return;
    }
    if (!form.notificationUrl.trim()) {
      setError("La URL de notificación (webhook) es obligatoria.");
      return;
    }
    setSaveLoading(true);
    try {
      await updateMercadoPagoConfig({
        accessToken: form.accessToken.trim(),
        backUrlSuccess: (form.backUrlSuccess || "").trim(),
        backUrlPending: (form.backUrlPending || "").trim(),
        backUrlFailure: (form.backUrlFailure || "").trim(),
        notificationUrl: form.notificationUrl.trim(),
      });
      setSuccess("Configuración guardada correctamente.");
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

  if (loading) {
    return (
      <Card className="card-sisvet mb-4">
        <Card.Header className="bg-sisvet-cobalto text-white">
          Mercado Pago
        </Card.Header>
        <Card.Body>
          <p className="mb-0">Cargando configuración...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="card-sisvet mb-4">
      <Card.Header className="bg-sisvet-cobalto text-white d-flex justify-content-between align-items-center">
        <span>Mercado Pago</span>
        {mpStatus?.configured ? (
          <span className="badge bg-success">Configurado</span>
        ) : (
          <span className="badge bg-secondary">No configurado</span>
        )}
      </Card.Header>
      <Card.Body>
        <p className="text-muted small mb-3">
          Una sola configuración para toda la aplicación. Obtén el Access Token
          en el panel de desarrolladores de Mercado Pago. Las URLs de retorno y
          de notificación deben ser accesibles desde internet (en local podés
          usar ngrok).
        </p>
        <Form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger py-2 small mb-3">{error}</div>
          )}
          {success && (
            <div className="alert alert-success py-2 small mb-3">{success}</div>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Access Token</Form.Label>
            <Form.Control
              type="password"
              value={form.accessToken}
              onChange={(e) => update("accessToken", e.target.value)}
              placeholder="APP_USR-..."
              className="form-control"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>URL éxito (backUrlSuccess)</Form.Label>
            <Form.Control
              type="url"
              value={form.backUrlSuccess}
              onChange={(e) => update("backUrlSuccess", e.target.value)}
              placeholder="https://tudominio.com/payment/success"
              className="form-control"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>URL pendiente (backUrlPending)</Form.Label>
            <Form.Control
              type="url"
              value={form.backUrlPending}
              onChange={(e) => update("backUrlPending", e.target.value)}
              placeholder="https://tudominio.com/payment/pending"
              className="form-control"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>URL fallo (backUrlFailure)</Form.Label>
            <Form.Control
              type="url"
              value={form.backUrlFailure}
              onChange={(e) => update("backUrlFailure", e.target.value)}
              placeholder="https://tudominio.com/payment/failure"
              className="form-control"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>URL de notificación / webhook</Form.Label>
            <Form.Control
              type="url"
              value={form.notificationUrl}
              onChange={(e) => update("notificationUrl", e.target.value)}
              placeholder="https://tudominio.com/api/payments/webhook"
              className="form-control"
            />
            <Form.Text className="text-muted">
              Configurá esta misma URL en el panel de Mercado Pago →
              Notificaciones / Webhooks.
            </Form.Text>
          </Form.Group>
          {config?.updatedAt && (
            <p className="text-muted small mb-2">
              Última actualización:{" "}
              {new Date(config.updatedAt).toLocaleString("es-AR")}
            </p>
          )}
          <Button
            type="submit"
            className="btn-sisvet-primary"
            disabled={saveLoading}
          >
            {saveLoading ? "Guardando..." : "Guardar configuración"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AdminMercadoPagoConfig;
