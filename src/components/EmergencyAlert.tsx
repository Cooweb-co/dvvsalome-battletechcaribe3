import { EMERGENCY_NUMBER } from "@/lib/red-flags";

export function EmergencyAlert({ flags }: { flags: string[] }) {
  if (flags.length === 0) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="animate-rise mt-4 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="h-3.5 w-3.5"
            aria-hidden
          >
            <path d="M12 8v5" />
            <path d="M12 17h.01" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-semibold text-rose-900">
            Lo que describís puede ser una emergencia
          </p>
          <p className="mt-1 text-sm leading-relaxed text-rose-800">
            Detectamos: {flags.join(", ").toLowerCase()}. No esperes el análisis:
            llamá al{" "}
            <a
              href={`tel:${EMERGENCY_NUMBER}`}
              className="font-semibold underline underline-offset-2"
            >
              {EMERGENCY_NUMBER}
            </a>{" "}
            o acudí al servicio de urgencias más cercano.
          </p>
        </div>
      </div>
    </div>
  );
}
