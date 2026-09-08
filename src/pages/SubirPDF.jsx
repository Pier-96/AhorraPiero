import { useState } from "react";
import { api, mesActual } from "../api/client.js";
import { Link } from "react-router-dom";
import { Button, Card, Field } from "../components/ui.jsx";

export default function SubirPDF() {
  const [file, setFile] = useState(null);
  const [mes, setMes] = useState(mesActual());
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const onSelect = (e) => {
    setFile(e.target.files?.[0] || null);
    setStatus(null);
    setError(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError(new Error("Selecciona un PDF primero."));
      return;
    }
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const res = await api.uploadPdf(file, mes);
      setStatus(res?.message || "PDF procesado. Revisa los movimientos en la pestaña Revisión.");
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card title="Extracto bancario (Imagin)">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] text-[color:var(--muted)] mb-1">
              Mes del extracto
            </label>
            <Field
              type="month"
              value={mes}
              onChange={(e) => setMes(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[13px] text-[color:var(--muted)] mb-1">
              Archivo PDF
            </label>
            <label className="block rounded-3xl border-2 border-dashed border-[color:var(--hairline)] px-4 py-7 text-center cursor-pointer pressable" style={{ background: "var(--surface-muted)" }}>
              <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-lg text-brand-700" aria-hidden>↑</span>
              <span className="block text-sm font-semibold">{file ? file.name : "Elige tu extracto en PDF"}</span>
              <span className="mt-1.5 block text-xs leading-relaxed text-[color:var(--muted)]">El archivo se procesará y preparará para tu revisión.</span>
              <input type="file" accept="application/pdf" onChange={onSelect} className="sr-only" />
            </label>
          </div>
          <Button type="submit" disabled={busy}>
            {busy ? "Procesando…" : "Subir y procesar"}
          </Button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-rose-600" role="alert">
            {error.message}
          </p>
        )}
        {status && <div className="mt-3 text-sm text-brand-700" role="status"><p>{status}</p><Link className="mt-2 inline-block font-medium underline underline-offset-2" to="/revision">Revisar movimientos →</Link></div>}
      </Card>
      <p className="text-xs text-[color:var(--muted)] px-1">
        El backend extrae el texto del PDF, lo categoriza con IA y guarda los
        movimientos en Google Sheets marcados como no revisados.
      </p>
    </div>
  );
}
