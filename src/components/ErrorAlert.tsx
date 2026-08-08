export function ErrorAlert({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="card animate-rise flex flex-wrap items-center justify-between gap-3 border-rose-200 bg-rose-50/80 p-5"
    >
      <div className="flex gap-3">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-0.5 h-5 w-5 shrink-0 text-rose-600"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-rose-900">
            No pudimos generar el reporte
          </p>
          <p className="mt-0.5 text-sm text-rose-800">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
