export function ReportSkeleton() {
  return (
    <div className="card p-6" aria-busy="true" aria-live="polite">
      <div className="h-5 w-44 animate-pulse rounded-full bg-slate-200" />
      <div className="mt-4 h-16 animate-pulse rounded-2xl bg-slate-100" />
      <div className="mt-5 space-y-2">
        <div className="h-3.5 w-full animate-pulse rounded-full bg-slate-200" />
        <div className="h-3.5 w-5/6 animate-pulse rounded-full bg-slate-200" />
        <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-slate-200" />
      </div>
      <div className="mt-6 space-y-3">
        {[0, 1].map((index) => (
          <div key={index} className="h-20 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
      <p className="mt-5 text-center text-xs text-slate-500">
        Analizando tus síntomas con IA…
      </p>
    </div>
  );
}
