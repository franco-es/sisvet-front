/**
 * Utilidades de autenticación y autorización.
 * Los roles se normalizan a mayúsculas y sin prefijo ROLE_ (p. ej. "ROLE_VENTAS" → "VENTAS").
 */

const USER_STORAGE_KEY = "user";

/**
 * Rol tal como viene de Spring (con o sin ROLE_) → nombre normalizado (sin prefijo, mayúsculas).
 */
function normalizeRole(r) {
  const name = typeof r === "string" ? r : r?.authority ?? r?.role ?? "";
  return name.toUpperCase().replace(/^ROLE_/, "");
}

/**
 * Usuario actual desde localStorage (objeto parseado o null).
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Lista de roles del usuario actual, normalizados (ej. ["ADMIN", "VENTAS"]).
 * Busca en user.roles o user.authorities; cada elemento puede ser string o { authority }.
 */
export function getRoles() {
  const user = getCurrentUser();
  const raw = user?.roles ?? user?.authorities ?? [];
  return raw.map(normalizeRole).filter(Boolean);
}

/**
 * True si el usuario tiene al menos uno de los roles indicados.
 * @param {string[]} roleNames - Ej. ["ADMIN", "VENTAS"]
 */
export function hasAnyRole(roleNames) {
  if (!Array.isArray(roleNames) || roleNames.length === 0) return false;
  const userRoles = getRoles();
  const allowed = roleNames.map((r) => String(r).toUpperCase().replace(/^ROLE_/, ""));
  return allowed.some((r) => userRoles.includes(r));
}

/**
 * True si el usuario tiene todos los roles indicados.
 * @param {string[]} roleNames - Ej. ["ADMIN"]
 */
export function hasAllRoles(roleNames) {
  if (!Array.isArray(roleNames) || roleNames.length === 0) return false;
  const userRoles = getRoles();
  const required = roleNames.map((r) => String(r).toUpperCase().replace(/^ROLE_/, ""));
  return required.every((r) => userRoles.includes(r));
}

// —— Permisos por módulo (centralizar acá qué roles permiten qué) ——

/** Roles que permiten usar el módulo de ventas (productos y ventas). */
export const ROLES_VENTAS = ["ADMIN", "VENTAS"];

/** True si el usuario puede ver y usar la sección Ventas. */
export function hasVentasRole() {
  return hasAnyRole(ROLES_VENTAS);
}

/** Solo rol ADMIN (para módulo de administración). */
export const ROLES_ADMIN = ["ADMIN"];

/** True si el usuario es administrador. */
export function hasAdminRole() {
  return hasAnyRole(ROLES_ADMIN);
}
