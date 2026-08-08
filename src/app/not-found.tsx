import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <div className="card max-w-md p-8 text-center">
        <p className="text-xs font-semibold tracking-wider text-brand-600 uppercase">
          Error 404
        </p>
        <h1 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
          No encontramos esta página
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Puede que el enlace esté mal escrito o que la página ya no exista.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
