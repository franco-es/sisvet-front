import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";

/**
 * Dropdown para elegir formato de informe (PDF / Excel).
 * onSelect(format) con format = "pdf" | "excel".
 */
const ReportFormatDropdown = ({ onSelect, title = "Informe", variant = "icon", disabled }) => {
  const [loading, setLoading] = useState(false);

  const handleSelect = async (format) => {
    if (!onSelect) return;
    setLoading(true);
    try {
      await onSelect(format);
    } finally {
      setLoading(false);
    }
  };

  const titleContent = title;
  const toggleLabel = variant === "icon" ? <i className="far fa-file-alt" title="Descargar informe" /> : titleContent;

  return (
    <Dropdown align="end" className="d-inline">
      <Dropdown.Toggle
        variant="link"
        className="btn-icon p-0 border-0 text-sisvet-cobalto"
        id={`report-dropdown-${variant}`}
        disabled={disabled || loading}
        title="Descargar informe"
        aria-label="Descargar informe"
      >
        {loading ? (
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
        ) : (
          toggleLabel
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleSelect("pdf")}>
          <i className="far fa-file-pdf me-2" /> PDF
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("excel")}>
          <i className="far fa-file-excel me-2" /> Excel
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ReportFormatDropdown;
