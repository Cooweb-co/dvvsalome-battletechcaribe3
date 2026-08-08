"use client";

import { useMemo, useState } from "react";
import { EmergencyAlert } from "./EmergencyAlert";
import { SeveritySelector } from "./SeveritySelector";
import { detectRedFlags } from "@/lib/red-flags";
import type { ConsultationInput, Severity } from "@/lib/types";

const MAX_CHARS = 1500;
const MIN_CHARS = 15;

const EXAMPLES = [
  "Dolor de cabeza pulsátil desde ayer, con náuseas y molestia con la luz.",
  "Tos seca hace 4 días, fiebre de 38 °C y cansancio.",
  "Dolor abdominal bajo, hinchazón y falta de apetito hace una semana.",
];

interface Props {
  onSubmit: (input: ConsultationInput) => void;
  loading: boolean;
}

export function SymptomForm({ onSubmit, loading }: Props) {
  const [symptoms, setSymptoms] = useState("");
  const [severity, setSeverity] = useState<Severity>("moderado");
  const [durationDays, setDurationDays] = useState("");
  const [age, setAge] = useState("");
  const [touched, setTouched] = useState(false);

  const tooShort = symptoms.trim().length < MIN_CHARS;
  const redFlags = useMemo(() => detectRedFlags(symptoms), [symptoms]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (tooShort || loading) return;

    onSubmit({
      symptoms: symptoms.trim(),
      severity,
      durationDays: durationDays === "" ? undefined : Number(durationDays),
      age: age === "" ? undefined : Number(age),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Contanos qué sentís
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Cuanto más detalle des (desde cuándo, dónde duele, qué lo empeora), más útil
          será el reporte.
        </p>
      </div>

      <label htmlFor="symptoms" className="text-sm font-medium text-slate-800">
        Descripción de síntomas
      </label>
      <textarea
        id="symptoms"
        value={symptoms}
        onChange={(event) => setSymptoms(event.target.value.slice(0, MAX_CHARS))}
        onBlur={() => setTouched(true)}
        disabled={loading}
        rows={6}
        placeholder="Ej: Hace tres días tengo dolor de garganta al tragar, fiebre por las tardes y ganglios inflamados en el cuello…"
        aria-invalid={touched && tooShort}
        aria-describedby="symptoms-help"
        className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none disabled:opacity-60 aria-[invalid=true]:border-rose-300"
      />
      <div
        id="symptoms-help"
        className="mt-1.5 flex items-center justify-between text-xs"
      >
        <span className={touched && tooShort ? "text-rose-600" : "text-slate-400"}>
          {touched && tooShort
            ? `Escribí al menos ${MIN_CHARS} caracteres.`
            : "Sin datos personales identificables, por favor."}
        </span>
        <span className="tabular-nums text-slate-400">
          {symptoms.length}/{MAX_CHARS}
        </span>
      </div>

      <EmergencyAlert flags={redFlags} />

      <div className="mt-4 flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            disabled={loading}
            onClick={() => setSymptoms(example)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 transition hover:border-brand-300 hover:text-brand-700 disabled:opacity-60"
          >
            {example.slice(0, 34)}…
          </button>
        ))}
      </div>

      <div className="mt-6">
        <SeveritySelector value={severity} onChange={setSeverity} disabled={loading} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="duration" className="text-sm font-medium text-slate-800">
            Duración (días) <span className="text-slate-400">· opcional</span>
          </label>
          <input
            id="duration"
            type="number"
            min={0}
            max={3650}
            inputMode="numeric"
            value={durationDays}
            disabled={loading}
            onChange={(event) => setDurationDays(event.target.value)}
            placeholder="3"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="age" className="text-sm font-medium text-slate-800">
            Edad <span className="text-slate-400">· opcional</span>
          </label>
          <input
            id="age"
            type="number"
            min={0}
            max={120}
            inputMode="numeric"
            value={age}
            disabled={loading}
            onChange={(event) => setAge(event.target.value)}
            placeholder="34"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none disabled:opacity-60"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:ring-4 focus-visible:ring-brand-500/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Analizando síntomas…
          </>
        ) : (
          <>
            Analizar síntomas
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
