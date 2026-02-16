import React, { useCallback } from "react";
import { Form } from "react-bootstrap";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";

/**
 * Campo de texto o textarea con botón de dictado por voz.
 * value, onChange, label, placeholder, rows (para textarea).
 * Si el navegador no soporta reconocimiento de voz, se muestra solo el campo sin micrófono.
 */
const VoiceToTextField = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  as = "textarea",
  required,
  id,
  className = "",
}) => {
  const onStopped = useCallback(
    (finalTranscript) => {
      if (!finalTranscript) return;
      const sep = value && !value.endsWith(" ") ? " " : "";
      onChange(value + sep + finalTranscript);
    },
    [value, onChange]
  );

  const {
    isSupported,
    isListening,
    error,
    start,
    stop,
  } = useSpeechRecognition({
    lang: "es-AR",
    continuous: true,
    interimResults: true,
    onStopped,
  });

  const handleMicClick = () => {
    if (isListening) stop();
    else start();
  };

  return (
    <Form.Group className={`mb-3 ${className}`}>
      {label && <Form.Label htmlFor={id}>{label}</Form.Label>}
      <div className="d-flex gap-1 align-items-flex-start">
        <Form.Control
          id={id}
          as={as}
          rows={as === "textarea" ? rows : undefined}
          type={as === "input" ? "text" : undefined}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="form-control flex-grow-1"
        />
        {isSupported && (
          <button
            type="button"
            className="voice-to-text-btn flex-shrink-0"
            onClick={handleMicClick}
            title={isListening ? "Detener dictado" : "Dictar con voz"}
            aria-label={isListening ? "Detener dictado" : "Dictar con voz"}
          >
            {isListening ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <Form.Text className="text-warning small">{error}</Form.Text>
      )}
    </Form.Group>
  );
};

export default VoiceToTextField;
