import React, { useEffect } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";

const Transcribir = () => {
  const navigate = useNavigate();
  const {
    isSupported,
    isListening,
    error,
    transcript,
    start,
    stop,
    resetTranscript,
    setTranscript,
  } = useSpeechRecognition({ lang: "es-AR", continuous: true, interimResults: true });

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/auth");
    }
  }, [navigate]);

  const handleCopy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
  };

  return (
    <Container fluid className="mt-5 px-3">
      <div className="hero-sisvet">
        <h1 className="mb-1">Transcripción</h1>
        <p className="mb-0 opacity-90">Voz a texto con el micrófono</p>
      </div>

      <Card className="card-sisvet border-0 mt-4">
        <Card.Body>
          {!isSupported ? (
            <p className="text-muted mb-0">
              Tu navegador no soporta reconocimiento de voz. Usá <strong>Chrome</strong> o{" "}
              <strong>Edge</strong> para esta función.
            </p>
          ) : (
            <>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <Button
                  className={isListening ? "btn-sisvet-outline-cobalto" : "btn-sisvet-primary"}
                  onClick={isListening ? stop : start}
                  disabled={!isSupported}
                >
                  {isListening ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                      Escuchando... (clic para detener)
                    </>
                  ) : (
                    <>
                      <i className="far fa-microphone me-2" aria-hidden="true" />
                      Iniciar dictado
                    </>
                  )}
                </Button>
                <Button
                  variant="link"
                  className="text-sisvet-cobalto p-0"
                  onClick={resetTranscript}
                  disabled={!transcript}
                >
                  Limpiar
                </Button>
                <Button
                  variant="link"
                  className="text-sisvet-cobalto p-0"
                  onClick={handleCopy}
                  disabled={!transcript}
                >
                  Copiar texto
                </Button>
              </div>
              {error && (
                <div className="alert alert-warning py-2 small mb-3" role="alert">
                  {error}
                </div>
              )}
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={10}
                  placeholder="El texto aparecerá aquí al hablar..."
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="form-control"
                  style={{ resize: "vertical" }}
                />
              </Form.Group>
              <p className="text-muted small mt-2 mb-0">
                Funciona mejor en Chrome o Edge. Asegurate de permitir el acceso al micrófono.
              </p>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Transcribir;
