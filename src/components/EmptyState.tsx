const STEPS = [
  {
    title: "Describí tus síntomas",
    text: "Contá qué sentís, desde cuándo y qué lo empeora.",
  },
  {
    title: "La IA los interpreta",
    text: "Analiza el texto y arma un reporte estructurado.",
  },
  {
    title: "Llevá el reporte a consulta",
    text: "Con posibles causas, señales de alarma y preguntas.",
  },
];

export function EmptyState() {
  return (
    <div className="card flex flex-col items-center p-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
          aria-hidden
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M12 11v6M9 14h6" />
        </svg>
      </span>
      <h3 className="mt-4 text-base font-semibold tracking-tight text-slate-900">
        Tu reporte aparecerá acá
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">
        Completá el formulario y en unos segundos vas a ver un análisis preliminar
        organizado.
      </p>

      <ol className="mt-6 w-full space-y-3 text-left">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-slate-800">{step.title}</p>
              <p className="text-xs text-slate-500">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
