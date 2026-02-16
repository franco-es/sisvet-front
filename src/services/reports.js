import { http } from "../api/http";

const FORMAT_PDF = "pdf";
const FORMAT_EXCEL = "excel";

function getFilenameFromHeaders(headers) {
  const cd = headers?.["content-disposition"] ?? headers?.get?.("content-disposition");
  const value = typeof cd === "string" ? cd : "";
  const starMatch = value.match(/filename\*=UTF-8''(.+?)(?:;|$)/i);
  if (starMatch) {
    try {
      return decodeURIComponent(starMatch[1].trim());
    } catch {
      return starMatch[1].trim();
    }
  }
  const plainMatch = value.match(/filename=["']?([^"';]+)["']?/i);
  return plainMatch ? plainMatch[1].trim() : null;
}

function downloadBlob(blob, fallbackFilename, extension) {
  const filename = fallbackFilename || `informe.${extension}`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function fetchAndDownload(url, fallbackFilename, extension) {
  const res = await http.get(url, { responseType: "blob" });
  const blob = res.data;
  const headers = res.headers;
  const filename = getFilenameFromHeaders(headers) || fallbackFilename || `informe.${extension}`;
  downloadBlob(blob, filename, extension);
}

export async function downloadPetProceduresReport(petId, format) {
  const f = format === FORMAT_EXCEL ? "excel" : "pdf";
  const ext = f === "excel" ? "xlsx" : "pdf";
  await fetchAndDownload(
    `/pets/${petId}/reports/procedures?format=${f}`,
    `procedimientos-mascota-${petId}.${ext}`,
    ext
  );
}

export async function downloadProcedureReport(petId, procedureId, format) {
  const f = format === FORMAT_EXCEL ? "excel" : "pdf";
  const ext = f === "excel" ? "xlsx" : "pdf";
  await fetchAndDownload(
    `/pets/${petId}/procedures/${procedureId}/report?format=${f}`,
    `procedimiento-${procedureId}.${ext}`,
    ext
  );
}

export async function downloadSaleReport(saleId, format) {
  const f = format === FORMAT_EXCEL ? "excel" : "pdf";
  const ext = f === "excel" ? "xlsx" : "pdf";
  await fetchAndDownload(
    `/sales/${saleId}/report?format=${f}`,
    `venta-${saleId}.${ext}`,
    ext
  );
}

export const ReportFormat = { PDF: FORMAT_PDF, EXCEL: FORMAT_EXCEL };
