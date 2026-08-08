"use client";

import { useState } from "react";
import { downloadReport, reportToText } from "@/lib/report-text";
import type { Consultation } from "@/lib/types";

const BUTTON_CLASS =
  "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900";

export function ReportActions({
  consultation,
  onNewConsultation,
}: {
  consultation: Consultation;
  onNewConsultation?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(reportToText(consultation));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <button type="button" onClick={handleCopy} className={BUTTON_CLASS}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
          aria-hidden
        >
          <rect width="14" height="14" x="8" y="8" rx="2" />
          <path d="M4 16V4a2 2 0 0 1 2-2h10" />
        </svg>
        {copied ? "Copiado" : "Copiar"}
      </button>

      <button
        type="button"
        onClick={() => downloadReport(consultation)}
        className={BUTTON_CLASS}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
          aria-hidden
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="m7 10 5 5 5-5" />
          <path d="M12 15V3" />
        </svg>
        Descargar
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        className={BUTTON_CLASS}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
          aria-hidden
        >
          <path d="M6 9V2h12v7" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect width="12" height="8" x="6" y="14" />
        </svg>
        Imprimir
      </button>

      {onNewConsultation && (
        <button
          type="button"
          onClick={onNewConsultation}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
            aria-hidden
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nueva consulta
        </button>
      )}
    </div>
  );
}
