import { useState } from "react";
import { api } from "../api/client.js";

export default function AccessGate({ onAccess }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.login(password);
      onAccess();
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-full flex items-center justify-center px-5 py-8">
      <section className="access-card w-full max-w-sm rounded-3xl p-6 sm:p-8" aria-labelledby="access-title">
        <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-2xl text-white shadow-lg shadow-brand-600/20" aria-hidden>€</div>
        <p className="text-[13px] font-semibold text-[color:var(--muted)]">AhorraPiero</p>
        <h1 id="access-title" className="mt-1 text-3xl font-bold tracking-[-0.03em]">Tu espacio privado</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">Introduce tu contraseña para consultar tus finanzas.</p>
        <form onSubmit={submit} className="mt-7 space-y-3">
          <label className="sr-only" htmlFor="app-password">Contraseña</label>
          <input
            id="app-password"
            type="password"
            autoComplete="current-password"
            className="field"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Contraseña"
            required
            autoFocus
          />
          {error && <p className="text-sm text-rose-600" role="alert">{error}</p>}
          <button type="submit" className="btn-primary pressable" disabled={busy}>
            {busy ? "Comprobando…" : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
