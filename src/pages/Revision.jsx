import { useState } from "react";
import {
  api,
  CATEGORIAS,
  SUBCATEGORIAS_SUMINISTROS,
  formatEuros,
  mesActual,
} from "../api/client.js";
import { useAsync } from "../hooks/useAsync.js";
import { Button, Loading, ErrorBox, Empty } from "../components/ui.jsx";
import MonthSelector from "../components/MonthSelector.jsx";

export default function Revision() {
  const [mes, setMes] = useState(mesActual());
  const { data, loading, error, refetch } = useAsync(
    () => api.getMovimientos(mes),
    [mes]
  );
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [savedMsg, setSavedMsg] = useState(null);
  const [filter, setFilter] = useState("pendientes");

  const rows = data?.movimientos || [];

  const update = (id, patch) =>
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));

  const current = (m) => drafts[m.id] || {};
  const isReviewed = (m) => current(m).revisado ?? (m.revisado === "sí" || m.revisado === true);
  const visibleRows = filter === "pendientes" ? rows.filter((m) => !isReviewed(m)) : rows;
  const pendingCount = rows.filter((m) => !isReviewed(m)).length;

  const saveRow = async (m) => {
    const patch = drafts[m.id];
    if (!patch) return;
    setSavingId(m.id);
    setSavedMsg(null);
    try {
      await api.updateMovimiento(m.id, patch);
      setSavedMsg(`Movimiento ${m.id} actualizado`);
      refetch();
      setDrafts((d) => {
        const next = { ...d };
        delete next[m.id];
        return next;
      });
    } catch (err) {
      setSavedMsg(`Error: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  };

  const saveAll = async () => {
    const changed = rows.filter((m) => drafts[m.id]);
    if (!changed.length) return;
    setSavingId("all");
    setSavedMsg(null);
    try {
      await Promise.all(changed.map((m) => api.updateMovimiento(m.id, drafts[m.id])));
      setDrafts({});
      setSavedMsg(`${changed.length} movimiento${changed.length === 1 ? "" : "s"} actualizado${changed.length === 1 ? "" : "s"}`);
      refetch();
    } catch (err) {
      setSavedMsg(`No se pudieron guardar todos los cambios: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <MonthSelector value={mes} onChange={setMes} />
        {savedMsg && (
          <span className="text-xs text-brand-700" role="status">
            {savedMsg}
          </span>
        )}
      </div>

      {loading && <Loading />}
      {error && <ErrorBox error={error} onRetry={refetch} />}
      {data && rows.length === 0 && (
        <Empty label="No hay movimientos para este mes. Sube un PDF primero." />
      )}

      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="segmented-control" role="group" aria-label="Filtrar movimientos">
                <button type="button" onClick={() => setFilter("pendientes")} aria-pressed={filter === "pendientes"}>Pendientes {pendingCount > 0 && `(${pendingCount})`}</button>
                <button type="button" onClick={() => setFilter("todos")} aria-pressed={filter === "todos"}>Todos</button>
              </div>
            </div>
            {Object.keys(drafts).length > 0 && (
              <Button onClick={saveAll} disabled={savingId === "all"} className="w-auto px-3 py-2 text-sm">
                {savingId === "all" ? "Guardando…" : `Guardar ${Object.keys(drafts).length} cambios`}
              </Button>
            )}
          </div>
          {visibleRows.length === 0 && <Empty label="Todo revisado. Buen trabajo." />}
          {visibleRows.map((m) => {
            const c = current(m);
            const cat = c.categoria ?? m.categoria;
            const showSub = cat === "Suministros";
            const dirty = !!drafts[m.id];
            return (
              <div
                key={m.id}
                className={`app-card rounded-3xl p-4 ${
                  dirty ? "!border-brand-500" : ""
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{m.concepto}</p>
                    <p className="text-xs text-[color:var(--muted)]">
                      {m.fecha} · {formatEuros(m.importe)}
                    </p>
                  </div>
                  <span
                    className={`rounded-lg px-2 py-1 text-sm font-bold ${
                      m.importe < 0 ? "text-rose-600" : "text-brand-600"
                    }`}
                    style={{ background: m.importe < 0 ? "rgba(244, 63, 94, 0.10)" : "var(--accent-soft)" }}
                  >
                    {formatEuros(m.importe)}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <select
                    value={cat}
                    onChange={(e) => update(m.id, { categoria: e.target.value })}
                    className="field py-2"
                  >
                    {CATEGORIAS.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                  <select
                    value={c.subcategoria ?? m.subcategoria ?? ""}
                    disabled={!showSub}
                    onChange={(e) =>
                      update(m.id, { subcategoria: e.target.value || null })
                    }
                    className="field py-2 disabled:opacity-40"
                  >
                    <option value="">Sin subcategoría</option>
                    {SUBCATEGORIAS_SUMINISTROS.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
                    <input
                      type="checkbox"
                      checked={
                        c.revisado ?? (m.revisado === "sí" || m.revisado === true)
                      }
                      onChange={(e) =>
                        update(m.id, { revisado: e.target.checked })
                      }
                      className="accent-brand-600"
                    />
                    Revisado
                  </label>
                  {dirty && (
                    <Button
                      onClick={() => saveRow(m)}
                      disabled={savingId === m.id}
                      className="w-auto px-3 py-1.5 text-sm"
                    >
                      {savingId === m.id ? "Guardando…" : "Guardar"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
