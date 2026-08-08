export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M3 12h4l2 5 4-10 2 5h6" />
            </svg>
          </span>
          <div className="leading-tight">
            <p className="text-base font-semibold tracking-tight text-slate-900">
              Vitalis
            </p>
            <p className="text-xs text-slate-500">Asistente de triaje con IA</p>
          </div>
        </div>

        <span className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          Información orientativa · no es diagnóstico
        </span>
      </div>
    </header>
  );
}
