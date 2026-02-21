import React, { useState, useEffect, useMemo } from "react";
import { Card, Table, Button, Badge } from "react-bootstrap";
import { FaPlus, FaFileAlt, FaEye, FaTimesCircle } from "react-icons/fa";
import { listSales, cancelSale } from "../../services/sales";
import { downloadSaleReport } from "../../services/reports";
import { getMercadoPagoStatus, createMercadoPagoPreference } from "../../services/payments";
import { getArcaConfig } from "../../services/arcaConfig";
import ReportFormatModal from "../reports/ReportFormatModal";
import NewSaleModal from "./NewSaleModal";
import SaleDetailModal from "./SaleDetailModal";

const STATUS_LABELS = {
  COMPLETED: { text: "Completada", variant: "success" },
  PENDING: { text: "Pendiente", variant: "warning" },
  CANCELLED: { text: "Cancelada", variant: "secondary" },
};

const SalesSection = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [detailSaleId, setDetailSaleId] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSaleId, setReportSaleId] = useState(null);
  const [mpConfigured, setMpConfigured] = useState(false);
  const [arcaConfigured, setArcaConfigured] = useState(false);
  const [payingSaleId, setPayingSaleId] = useState(null);

  const loadSales = async () => {
    setLoading(true);
    try {
      const data = await listSales();
      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar ventas:", err);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  useEffect(() => {
    getMercadoPagoStatus()
      .then((data) => setMpConfigured(data?.configured === true))
      .catch(() => setMpConfigured(false));
  }, []);

  useEffect(() => {
    getArcaConfig()
      .then((data) => setArcaConfigured(data?.configured === true))
      .catch(() => setArcaConfigured(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("¿Cancelar esta venta? Se devolverá el stock.")) return;
    try {
      await cancelSale(id);
      loadSales();
    } catch (err) {
      console.error("Error al cancelar venta:", err);
    }
  };

  const formatPrice = (value) => {
    const n = typeof value === "number" ? value : parseFloat(value);
    if (isNaN(n)) return "—";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(n);
  };

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("es-AR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredSales = useMemo(() => {
    if (!statusFilter) return sales;
    return sales.filter((s) => (s.status || "").toUpperCase() === statusFilter);
  }, [sales, statusFilter]);

  const statusLabel = (s) => {
    if (s === "COMPLETED") return "Completada";
    if (s === "PENDING") return "Pendiente";
    if (s === "CANCELLED") return "Cancelada";
    return s || "—";
  };

  const paymentStatusLabel = (p) => {
    if (p === "PAID") return "Pagado";
    if (p === "PENDING_PAYMENT") return "Pago pendiente";
    if (p === "REJECTED") return "Rechazado";
    return p ? String(p) : "—";
  };

  const invoiceTypeLabel = (t) => {
    if (!t) return "—";
    const map = { FACTURA_A: "F. A", FACTURA_B: "F. B", FACTURA_C: "F. C", FACTURA_ELECTRONICA: "F. electr." };
    return map[t] || t;
  };

  const paymentTypeLabel = (t) => {
    if (!t) return "—";
    const map = { EFECTIVO: "Efectivo", TARJETA: "Tarjeta", MERCADO_PAGO: "Mercado Pago" };
    return map[t] || t;
  };

  const handlePayWithMP = async (sale) => {
    const url = sale?.mpCheckoutUrl;
    if (url) {
      window.location.href = url;
      return;
    }
    const saleId = sale?.id ?? sale;
    setPayingSaleId(saleId);
    try {
      const data = await createMercadoPagoPreference(saleId);
      const redirectUrl = data?.mpCheckoutUrl ?? data?.initPoint;
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }
    } catch (err) {
      console.error("Error al crear preferencia de pago:", err);
    } finally {
      setPayingSaleId(null);
    }
  };

  return (
    <>
      <Card className="turnos-page-card border-0 h-100">
        <Card.Body className="p-0">
          <div className="turnos-page-toolbar px-0">
            <Button
              className="btn-sisvet-primary d-inline-flex align-items-center gap-2"
              onClick={() => setShowNewModal(true)}
            >
              <FaPlus aria-hidden />
              Nueva venta
            </Button>
            <select
              className="turnos-page-filter form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filtrar por estado"
            >
              <option value="">Todos los estados</option>
              <option value="COMPLETED">Completadas</option>
              <option value="PENDING">Pendientes</option>
              <option value="CANCELLED">Canceladas</option>
            </select>
          </div>

          {loading ? (
            <p className="mb-0 text-muted py-4">Cargando ventas...</p>
          ) : sales.length === 0 ? (
            <p className="mb-0 text-muted py-4">No hay ventas registradas. Creá una con «Nueva venta».</p>
          ) : filteredSales.length === 0 ? (
            <p className="mb-0 text-muted py-4">No hay ventas con el filtro seleccionado.</p>
          ) : (
            <div className="table-responsive">
              <Table hover className="turnos-page-table align-middle">
                <thead>
                  <tr>
                    <th>Fecha y hora</th>
                    <th>Total</th>
                    <th>Factura</th>
                    <th>Tipo pago</th>
                    <th>Estado</th>
                    <th>Estado pago</th>
                    <th className="text-center" style={{ width: "140px", minWidth: "140px" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((s) => {
                    const statusInfo = STATUS_LABELS[s.status] || { text: statusLabel(s.status), variant: "secondary" };
                    return (
                      <tr key={s.id}>
                        <td>{formatDate(s.saleDate)}</td>
                        <td>{formatPrice(s.total)}</td>
                        <td>
                          {s.invoiceTypeName ?? invoiceTypeLabel(s.invoiceType)}
                          {s.electronicInvoiceCae && (
                            <span className="ms-1 text-success" title="Factura electrónica emitida">
                              <i className="fas fa-file-invoice" aria-hidden="true"></i>
                            </span>
                          )}
                        </td>
                        <td>{s.paymentTypeName ?? paymentTypeLabel(s.paymentType)}</td>
                        <td>
                          <Badge bg={statusInfo.variant} className="turnos-page-badge">
                            {statusInfo.text}
                          </Badge>
                        </td>
                        <td>
                          {paymentStatusLabel(s.paymentStatus)}
                          {s.paymentStatus === "PENDING_PAYMENT" && mpConfigured && (
                            <Button
                              size="sm"
                              className="btn-sisvet-primary ms-2"
                              disabled={payingSaleId === s.id}
                              onClick={() => handlePayWithMP(s)}
                            >
                              {payingSaleId === s.id ? "..." : "Pagar con MP"}
                            </Button>
                          )}
                        </td>
                        <td className="text-center turnos-page-actions">
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => {
                              setReportSaleId(s.id);
                              setShowReportModal(true);
                            }}
                            title="Descargar informe"
                            aria-label="Descargar informe"
                          >
                            <FaFileAlt />
                          </button>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => setDetailSaleId(s.id)}
                            title="Ver detalle"
                            aria-label="Ver detalle"
                          >
                            <FaEye />
                          </button>
                          {s.status === "PENDING" && (
                            <button
                              type="button"
                              className="btn-icon btn-icon-danger"
                              onClick={() => handleCancel(s.id)}
                              title="Cancelar venta"
                              aria-label="Cancelar venta"
                            >
                              <FaTimesCircle />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
      <NewSaleModal
        show={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSuccess={loadSales}
        mpConfigured={mpConfigured}
      />
      <SaleDetailModal
        show={detailSaleId != null}
        onClose={() => setDetailSaleId(null)}
        saleId={detailSaleId}
        onEmitted={loadSales}
        arcaConfigured={arcaConfigured}
      />
      <ReportFormatModal
        show={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          setReportSaleId(null);
        }}
        onSelect={(format) =>
          reportSaleId ? downloadSaleReport(reportSaleId, format) : Promise.resolve()
        }
        title="Descargar informe de venta"
      />
    </>
  );
};

export default SalesSection;
