import { http } from "../api/http";

// —— Auth (login / registro) ——

export async function login(email, password) {
  const body = { email, password };
  const res = await http.post("/auth/login", body);
  if (res.data && res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export async function register(email, password, name) {
  const res = await http.post("/auth/register", {
    email,
    password,
    nombre: name,
    rol: "vete",
  });
  return res.data;
}

// —— Admin usuarios ——

export async function listUsers() {
  const res = await http.get("/users");
  return res.data;
}

export async function getUsersCreatedBy(creatorId) {
  const res = await http.get(`/auth/admin/users/created-by/${creatorId}`);
  return res.data;
}

export async function createUser(email, password, nombre, rol, matricula) {
  const body = { email, password, nombre, rol: rol || "vete" };
  if (matricula != null && matricula !== "") body.matricula = matricula;
  const res = await http.post("/auth/register", body);
  return res.data;
}

export async function updateUserMaxUsersToCreate(userId, maxUsersToCreate) {
  await http.put(`/auth/admin/users/${userId}/max-users-to-create`, {
    maxUsersToCreate:
      maxUsersToCreate === "" || maxUsersToCreate == null
        ? null
        : Number(maxUsersToCreate),
  });
}

/**
 * Obtiene un usuario por ID para el formulario de edición. Solo ADMIN. No aplica a usuarios ADMIN.
 * @param { number } id
 * @returns { Promise<{ id, email, nombre, roles, active, matricula, ... }> }
 */
export async function getUserByIdForAdmin(id) {
  const res = await http.get(`/auth/admin/users/${id}`);
  return res.data;
}

/**
 * Actualiza un usuario. Solo ADMIN. Body UserUpdateDto: solo los campos enviados se actualizan.
 * @param { number } id
 * @param { { nombre?: string, email?: string, matricula?: string | null, roles?: string[], password?: string, active?: boolean } } dto
 * @returns { Promise } usuario actualizado
 */
export async function updateUserByAdmin(id, dto) {
  const res = await http.put(`/auth/admin/users/${id}`, dto);
  return res.data;
}

/**
 * Elimina un usuario. Solo ADMIN. No aplica a usuarios con rol ADMIN.
 * @param { number } id
 */
export async function deleteUserByAdmin(id) {
  await http.delete(`/auth/admin/users/${id}`);
}

/**
 * Agrega un rol al usuario. Solo ADMIN. No se puede asignar ROLE_ADMIN.
 * @param { number } id - ID del usuario
 * @param { string } role - Ej: "ROLE_VENTAS", "ROLE_USER", "ROLE_VET"
 */
export async function addRoleToUser(id, role) {
  const res = await http.post(`/auth/admin/users/${id}/roles`, { role });
  return res.data;
}

/**
 * Quita un rol del usuario. Solo ADMIN. El usuario debe conservar al menos un rol.
 * @param { number } id - ID del usuario
 * @param { string } roleName - Ej: "ROLE_VENTAS"
 */
export async function removeRoleFromUser(id, roleName) {
  await http.delete(`/auth/admin/users/${id}/roles/${encodeURIComponent(roleName)}`);
}
