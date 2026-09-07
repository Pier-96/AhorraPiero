// En desarrollo se usa el proxy de Vite; en producción apunta a Render.
const BASE = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const TOKEN_KEY = "ahorrapiero-session";

export function getSessionToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(getSessionToken() ? { Authorization: `Bearer ${getSessionToken()}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      /* ignore */
    }
    const error = new Error(message);
    error.status = res.status;
    if (res.status === 401) window.dispatchEvent(new Event("ahorrapiero:unauthorized"));
    throw error;
  }

  if (res.status === 204) return null;
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;
  return res.json();
}

export const api = {
  async login(password) {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    sessionStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },

  getSession() {
    return request("/auth/session");
  },

  uploadPdf(file, mes) {
    const fd = new FormData();
    fd.append("pdf", file);
    if (mes) fd.append("mes", mes);
    return request("/upload-pdf", { method: "POST", body: fd });
  },

  getMovimientos(mes) {
    const q = mes ? `?mes=${encodeURIComponent(mes)}` : "";
    return request(`/movimientos${q}`);
  },

  updateMovimiento(id, patch) {
    return request(`/movimientos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  },

  getResumenMensual() {
    return request("/resumen-mensual");
  },

  getResumenMes(mes) {
    return request(`/resumen-mensual/${encodeURIComponent(mes)}`);
  },

  getInversion() {
    return request("/inversion");
  },

  addInversion(payload) {
    return request("/inversion", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

};

export const CATEGORIAS = [
  "Alquiler",
  "Suministros",
  "Alimentacion",
  "Ocio",
  "Transporte",
  "Compras",
  "Ropa",
  "Salud",
  "Viajes",
  "Regalos",
  "Varios",
  "Ingreso",
  "Transferencia",
];

export const SUBCATEGORIAS_SUMINISTROS = ["Luz", "Agua", "Gas", "Internet", "Mixto"];

export function formatEuros(n) {
  if (n == null || Number.isNaN(n)) return "—";
  const sign = n < 0 ? "-" : "";
  return `${sign}${new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(Math.abs(n))}`;
}

export function mesActual() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
