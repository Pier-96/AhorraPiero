import { useState } from "react";
import { api, mesActual, formatEuros } from "../api/client.js";
import { useAsync } from "../hooks/useAsync.js";
import { Button, Card, Field, Loading, ErrorBox, Empty } from "../components/ui.jsx";

export default function Inversion() {
  const { data, loading, error, refetch } = useAsync(() => api.getInversion(), []);
  const [form, setForm] = useState({
    mes: mesActual(),
    importe_aportado: "",
    precio_participacion: "",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const rows = data?.inversion || [];

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await api.addInversion({
        mes: form.mes,
        importe_aportado: Number(form.importe_aportado),
        precio_participacion: Number(form.precio_participacion),
      });
      setMsg("Aportación registrada.");
      setForm((f) => ({ ...f, importe_aportado: "", precio_participacion: "" }));
      refetch();
    } catch (err) {
      setMsg(`Error: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  const ultimo = rows[rows.length - 1];

  return (
    <div className="space-y-4">
      <Card title="Registrar aportación mensual">
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-[color:var(--muted)] mb-1">Mes</label>
              <Field
                type="month"
                name="mes"
                value={form.mes}
                onChange={onChange}
              />
            </div>
            <div>
              <label className="block text-xs text-[color:var(--muted)] mb-1">Importe (€)</label>
              <Field
                type="number"
                step="0.01"
                name="importe_aportado"
                value={form.importe_aportado}
                onChange={onChange}
                placeholder="200"
              />
            </div>
            <div>
              <label className="block text-xs text-[color:var(--muted)] mb-1">Precio part. (€)</label>
              <Field
                type="number"
                step="0.01"
                name="precio_participacion"
                value={form.precio_participacion}
                onChange={onChange}
                placeholder="450.00"
              />
            </div>
          </div>
          <Button type="submit" disabled={busy}>
            {busy ? "Guardando…" : "Registrar aportación"}
          </Button>
        </form>
        {msg && <p className="mt-2 text-sm text-brand-700">{msg}</p>}
      </Card>

      <Card title="Estado actual del fondo">
        {loading && <Loading />}
        {error && <ErrorBox error={error} onRetry={refetch} />}
        {data && rows.length === 0 && (
          <Empty label="Aún no hay aportaciones registradas." />
        )}
        {ultimo && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[color:var(--muted)]">Participaciones totales</p>
              <p className="text-[1.375rem] font-semibold leading-tight tracking-[-0.02em]">
                {ultimo.participaciones_totales?.toFixed(4) ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[color:var(--muted)]">Valor actual</p>
              <p className="text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] text-brand-600">
                {formatEuros(ultimo.valor_actual)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[color:var(--muted)]">Rentabilidad acumulada</p>
              <p className="text-[1.375rem] font-semibold leading-tight tracking-[-0.02em]">
                {formatEuros(ultimo.rentabilidad_acumulada)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[color:var(--muted)]">Último mes</p>
              <p className="text-[1.375rem] font-semibold leading-tight tracking-[-0.02em]">{ultimo.mes}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
