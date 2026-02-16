import { http } from "../api/http";

const BASE = (petId, procedureId) =>
  `/pets/${petId}/procedures/${procedureId}/attachments`;

export async function listAttachments(petId, procedureId) {
  const res = await http.get(BASE(petId, procedureId));
  const data = res.data;
  return Array.isArray(data) ? data : [];
}

export async function uploadAttachment(
  petId,
  procedureId,
  file,
  description = ""
) {
  const form = new FormData();
  form.append("file", file);
  if (description) form.append("description", description);
  const res = await http.post(BASE(petId, procedureId), form);
  return res.data;
}

export async function downloadAttachment(
  petId,
  procedureId,
  attachmentId,
  fileName = null
) {
  const res = await http.get(
    `${BASE(petId, procedureId)}/${attachmentId}`,
    { responseType: "blob" }
  );
  const blob = res.data;
  const cd = res.headers?.["content-disposition"] ?? "";
  let name = fileName;
  if (!name) {
    const m =
      cd.match(/filename\*=UTF-8''(.+?)(?:;|$)/i) ||
      cd.match(/filename=["']?([^"';]+)["']?/i);
    if (m) name = m[1].trim();
    try {
      if (cd.includes("UTF-8''")) name = decodeURIComponent(name);
    } catch (_) {}
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name || `adjunto-${attachmentId}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function deleteAttachment(petId, procedureId, attachmentId) {
  await http.delete(`${BASE(petId, procedureId)}/${attachmentId}`);
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ACCEPT_TYPES =
  "image/*,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";
