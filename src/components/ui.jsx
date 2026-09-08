export function Card({ title, children, className = "" }) {
  return (
    <section
      className={`app-card rounded-3xl p-4 sm:p-5 ${className}`}
    >
      {title && (
        <h2 className="eyebrow mb-4">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export function Stat({ label, value, tone = "default" }) {
  const tones = {
    default: "text-[color:var(--fg)]",
    positive: "text-brand-600",
    negative: "text-rose-600",
  };
  return (
    <div>
      <p className="text-[12px] font-medium text-[color:var(--muted)] leading-snug">{label}</p>
      <p
        className={`mt-0.5 text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] ${tones[tone]}`}
      >
        {value}
      </p>
    </div>
  );
}

export function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}) {
  const variants = {
    primary: "btn-primary",
    ghost:
      "rounded-xl px-3 py-2 text-sm font-semibold bg-brand-50 text-brand-700",
  };
  return (
    <button
      type={type}
      className={`pressable ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({ className = "", ...props }) {
  return <input className={`field ${className}`} {...props} />;
}

export function Loading({ label = "Cargando…" }) {
  return (
    <div className="py-10 text-center text-[color:var(--muted)] text-sm" role="status">
      {label}
    </div>
  );
}

export function ErrorBox({ error, onRetry }) {
  return (
    <div
      className="border border-rose-500/25 text-rose-700 rounded-xl p-4 text-sm"
      style={{ background: "rgba(244, 63, 94, 0.10)" }}
      role="alert"
    >
      <p className="font-medium">No pudimos cargar estos datos</p>
      <p className="mt-1">Comprueba tu conexión con el servidor y vuelve a intentarlo.</p>
      {onRetry && (
        <Button
          variant="ghost"
          onClick={onRetry}
          className="mt-3 bg-rose-500/10 text-rose-700"
        >
          Reintentar
        </Button>
      )}
    </div>
  );
}

export function Empty({ label = "Sin datos todavía." }) {
  return (
    <div className="py-10 text-center text-[color:var(--muted)] text-sm">{label}</div>
  );
}
