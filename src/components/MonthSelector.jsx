export default function MonthSelector({ value, onChange }) {
  const changeMonth = (offset) => {
    const [year, month] = value.split("-").map(Number);
    const date = new Date(year, month - 1 + offset, 1);
    onChange(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
  };

  return (
    <div className="flex items-center gap-1.5" aria-label="Elegir mes">
      <button type="button" className="month-step pressable" onClick={() => changeMonth(-1)} aria-label="Mes anterior"><span aria-hidden>‹</span></button>
      <input
        type="month"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Elegir mes"
        className="field py-2 w-auto min-w-0"
      />
      <button type="button" className="month-step pressable" onClick={() => changeMonth(1)} aria-label="Mes siguiente"><span aria-hidden>›</span></button>
    </div>
  );
}
