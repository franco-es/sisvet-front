import { useState, useEffect, useRef, useCallback } from "react";

const SpeechRecognitionAPI =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);

/**
 * Hook para reconocimiento de voz (voz a texto).
 * Usa la Web Speech API. Mejor soporte en Chrome, Edge y Safari.
 * @param {object} options - { lang: 'es-AR', continuous: true, interimResults: true }
 * @returns { object } { isSupported, isListening, error, start, stop, transcript }
 */
const STOP_DELAY_MS = 200;

export function useSpeechRecognition(options = {}) {
  const {
    lang = "es-AR",
    continuous = true,
    interimResults = true,
    onStopped,
  } = options;

  const [isSupported] = useState(!!SpeechRecognitionAPI);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");
  const onStoppedRef = useRef(onStopped);
  onStoppedRef.current = onStopped;

  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const start = useCallback(() => {
    if (!SpeechRecognitionAPI) {
      setError("Tu navegador no soporta reconocimiento de voz. Probá Chrome o Edge.");
      return;
    }
    setError(null);
    transcriptRef.current = "";
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new Recognition();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal && result[0].transcript) {
          const chunk = result[0].transcript;
          transcriptRef.current += chunk;
          setTranscript((prev) => prev + chunk);
        }
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech") return;
      if (event.error === "not-allowed") {
        setError("Se denegó el permiso al micrófono.");
        stop();
        return;
      }
      setError(event.error || "Error de reconocimiento.");
    };

    recognition.onend = () => {
      setIsListening(false);
      setTimeout(() => {
        const finalTranscript = transcriptRef.current;
        transcriptRef.current = "";
        setTranscript("");
        if (finalTranscript) {
          onStoppedRef.current?.(finalTranscript);
        }
      }, STOP_DELAY_MS);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [continuous, interimResults, lang, stop, isListening]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

  const resetTranscript = useCallback(() => {
    transcriptRef.current = "";
    setTranscript("");
  }, []);

  return {
    isSupported,
    isListening,
    error,
    transcript,
    start,
    stop,
    resetTranscript,
    setTranscript,
  };
}

export default useSpeechRecognition;
