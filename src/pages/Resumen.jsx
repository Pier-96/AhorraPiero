import { useState } from "react";
import { api, mesActual, formatEuros } from "../api/client.js";
import { useAsync } from "../hooks/useAsync.js";
import { Link } from "react-router-dom";
import { Card, Stat, Loading, ErrorBox, Empty } from "../components/ui.jsx";
import MonthSelector from "../components/MonthSelector.jsx";

export default function Resumen() {
  const [mes, setMes] = useState(mesActual());
  const { data, loading, error, refetch } = useAsync(
    () => api.getResumenMes(mes),
    [mes]
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <MonthSelector value={mes} onChange={setMes} />
      </div>
      <Card>
        {loading && <Loading />}
        {error && <ErrorBox error={error} onRetry={refetch} />}
        {data && !data.found && <Empty label="Aún no hay un extracto procesado para este mes. Sube uno para ver tu balance." />}
        {data && data.found && (() => {
          const ahorroTotal =
            (data.ahorro_liquido || 0) + (data.transferencias_ahorro || 0);
          return (
          <div>
            <div className="rounded-2xl bg-brand-50 px-4 py-4 mb-5">
              <p className="text-[13px] font-medium text-brand-700">Ahorro total del mes</p>
              <p className={`mt-1 text-4xl font-bold tracking-[-0.035em] ${ahorroTotal < 0 ? "text-rose-600" : "text-brand-700"}`}>
                {formatEuros(ahorroTotal)}
              </p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">Incluye el ahorro en tu cuenta principal y las transferencias.</p>
            </div>
            <p className="mb-3 text-[13px] font-semibold text-[color:var(--muted)]">Desglose de {mes}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <Stat label="Ingresos" value={formatEuros(data.ingresos)} tone="positive" />
            <Stat
              label="Gastos totales"
              value={formatEuros(-Math.abs(data.gastos_totales))}
              tone="negative"
            />
            <Stat
              label="Gastos extraordinarios"
              value={formatEuros(-Math.abs(data.gastos_extraordinarios))}
              tone="negative"
            />
            <Stat
              label="Aportación inversión"
              value={formatEuros(-Math.abs(data.aportacion_inversion))}
              tone="negative"
            />
            <Stat
              label="Ahorro en otra cuenta"
              value={formatEuros(data.transferencias_ahorro)}
              tone="positive"
            />
            <Stat
              label="Ahorro líquido (cuenta principal)"
              value={formatEuros(data.ahorro_liquido)}
              tone={data.ahorro_liquido < 0 ? "negative" : "positive"}
            />
            <Stat label="Salario neto" value={formatEuros(data.salario_neto)} />
            </div>
          </div>
          );
        })()}
      </Card>

      <Card title="Atajos">
        <div className="flex flex-wrap gap-2">
          <Link
            to="/subir"
            className="pressable px-3 py-2 rounded-xl bg-brand-50 text-brand-700 text-sm font-medium"
          >
            Subir extracto
          </Link>
          <Link
            to="/revision"
            className="pressable px-3 py-2 rounded-xl bg-brand-50 text-brand-700 text-sm font-medium"
          >
            Revisar movimientos
          </Link>
          <Link
            to="/graficas"
            className="pressable px-3 py-2 rounded-xl bg-brand-50 text-brand-700 text-sm font-medium"
          >
            Ver gráficas
          </Link>
        </div>
      </Card>
    </div>
  );
}
