"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <div className="card max-w-md p-8 text-center">
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">
          Algo se rompió de nuestro lado
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Tus consultas guardadas siguen intactas en este navegador. Podés reintentar
          sin perder nada.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-slate-400">
            Referencia: {error.digest}
          </p>
        )}
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
