import { http } from "../api/http";

/**
 * Configuración ARCA/AFIP (facturación electrónica directa WSAA + WSFE).
 * Multi-tenant: cada usuario tiene su CUIT, certificado y clave privada.
 * GET no devuelve certificatePem ni privateKeyPem por seguridad.
 */
export async function getArcaConfig() {
  const res = await http.get("/arca-config");
  return res.data;
}

/**
 * Body: { cuit, certificatePem?, privateKeyPem?, environment?, puntoVenta?, cbteTipo?, enabled? }
 * Sigue disponible para pegar PEM como texto.
 */
export async function updateArcaConfig(body) {
  const res = await http.put("/arca-config", body);
  return res.data;
}

/**
 * Sube certificado y/o clave como archivos (multipart/form-data).
 * formData debe incluir: certificate? (archivo), privateKey? (archivo), cuit?, environment?, puntoVenta?, cbteTipo?, enabled?
 */
export async function updateArcaConfigUpload(formData) {
  const res = await http.put("/arca-config/upload", formData);
  return res.data;
}

/**
 * Genera CSR (PKCS#10) y clave privada RSA 2048 para AFIP.
 * Body: { cuit, organizationName?, commonName? }
 * Respuesta: { csrPem, privateKeyPem }
 */
export async function generateCsr(body) {
  const res = await http.post("/arca-config/generate-csr", body);
  return res.data;
}
