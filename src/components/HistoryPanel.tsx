"use client";

import { useMemo, useState } from "react";
import { SEVERITY_META, URGENCY_META } from "@/lib/constants";
import { formatRelativeTime } from "@/lib/relative-time";
import type { Consultation } from "@/lib/types";

interface Props {
  consultations: Consultation[];
  activeId?: string;
  onSelect: (consultation: Consultation) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function HistoryPanel({
  consultations,
  activeId,
  onSelect,
  onRemove,
  onClear,
}: Props) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return consultations;
    return consultations.filter((item) =>
      item.input.symptoms.toLowerCase().includes(needle),
    );
  }, [consultations, query]);

  return (
    <aside className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-tight text-slate-900">
          Historial de consultas
        </h3>
        {consultations.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-slate-500 transition hover:text-rose-600"
          >
            Vaciar
          </button>
        )}
      </div>

      {consultations.length === 0 ? (
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          Tus consultas se guardan solo en este navegador (LocalStorage).
          Todavía no hay ninguna.
        </p>
      ) : (
        <>
          {consultations.length > 3 && (
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar en el historial…"
              aria-label="Buscar en el historial"
              className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none"
            />
          )}

          {visible.length === 0 && (
            <p className="mt-3 text-xs text-slate-500">
              Ninguna consulta coincide con “{query}”.
            </p>
          )}

          <ul className="mt-3 space-y-2">
            {visible.map((item) => {
              const isActive = item.id === activeId;
              return (
                <li key={item.id}>
                  <div
                    className={`group flex items-start gap-2 rounded-xl border px-3 py-2.5 transition ${
                      isActive
                        ? "border-brand-300 bg-brand-50/60"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(item)}
                      className="flex-1 text-left"
                    >
                      <p className="line-clamp-2 text-xs leading-snug text-slate-700">
                        {item.input.symptoms}
                      </p>
                      <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${SEVERITY_META[item.input.severity].dot}`}
                        />
                      {URGENCY_META[item.report.urgency].label}
                      {" · "}
                      {formatRelativeTime(item.createdAt)}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(item.id)}
                      aria-label="Eliminar consulta"
                      className="rounded-md p-1 text-slate-300 opacity-0 transition group-hover:opacity-100 hover:text-rose-500 focus-visible:opacity-100"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="h-4 w-4"
                        aria-hidden
                      >
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </aside>
  );
}
