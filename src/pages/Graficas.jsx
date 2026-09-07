import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useState } from "react";
import { api, mesActual, formatEuros } from "../api/client.js";
import { useAsync } from "../hooks/useAsync.js";
import { Card, Loading, ErrorBox } from "../components/ui.jsx";
import MonthSelector from "../components/MonthSelector.jsx";

const PIE_COLORS = [
  "#10b981",
  "#059669",
  "#34d399",
  "#0ea5e9",
  "#6366f1",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

export default function Graficas() {
  const [mes, setMes] = useState(mesActual());
  const resumen = useAsync(() => api.getResumenMensual(), []);
  const movimientos = useAsync(() => api.getMovimientos(mes), [mes]);
  const inversion = useAsync(() => api.getInversion(), []);

  const resumenRows = resumen.data?.resumen || [];
  const invRows = inversion.data?.inversion || [];

  const movs = movimientos.data?.movimientos || [];
  const porCategoria = agruparPorCategoria(movs);

  const anyLoading = resumen.loading || movimientos.loading || inversion.loading;
  const anyError = resumen.error || movimientos.error || inversion.error;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <MonthSelector value={mes} onChange={setMes} />
      </div>

      {anyLoading && <Loading />}
      {anyError && (
        <ErrorBox
          error={anyError}
          onRetry={() => {
            resumen.refetch();
            movimientos.refetch();
            inversion.refetch();
          }}
        />
      )}

      <Card title="Evolución mensual">
        {resumenRows.length === 0 ? (
          <p className="text-sm text-[color:var(--muted)]">Sin historial mensual todavía.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={resumenRows}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--hairline)" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "var(--muted)" }} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} width={48} />
              <Tooltip formatter={(v) => formatEuros(v)} />
              <Legend />
              <Line type="monotone" dataKey="ingresos" name="Ingresos" stroke="#10b981" />
              <Line type="monotone" dataKey="gastos_totales" name="Gastos" stroke="#ef4444" />
              <Line type="monotone" dataKey="ahorro_liquido" name="Ahorro" stroke="#0ea5e9" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card title={`Gasto por categoría · ${mes}`}>
        {porCategoria.length === 0 ? (
          <p className="text-sm text-[color:var(--muted)]">Sin gastos categorizados.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={porCategoria}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label={(e) => e.name}
              >
                {porCategoria.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatEuros(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card title="Fondo de inversión (S&P 500)">
        {invRows.length === 0 ? (
          <p className="text-sm text-[color:var(--muted)]">Sin datos de inversión todavía.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={invRows}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--hairline)" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "var(--muted)" }} />
              <YAxis tick={{ fontSize: 12, fill: "var(--muted)" }} width={56} />
              <Tooltip formatter={(v) => formatEuros(v)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="valor_actual"
                name="Valor actual"
                stroke="#10b981"
              />
              <Line
                type="monotone"
                dataKey="rentabilidad_acumulada"
                name="Rentab. acum."
                stroke="#6366f1"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
}

function agruparPorCategoria(movimientos) {
  const map = new Map();
  for (const m of movimientos) {
    if (m.tipo === "ingreso" || m.categoria === "Ingreso") continue;
    if (m.importe >= 0) continue;
    const key = m.categoria || "Varios";
    map.set(key, (map.get(key) || 0) + Math.abs(m.importe));
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value);
}
