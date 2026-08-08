"use client";

import { useState } from "react";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { EmptyState } from "@/components/EmptyState";
import { ErrorAlert } from "@/components/ErrorAlert";
import { Header } from "@/components/Header";
import { HistoryPanel } from "@/components/HistoryPanel";
import { ReportSkeleton } from "@/components/ReportSkeleton";
import { ReportView } from "@/components/ReportView";
import { SymptomForm } from "@/components/SymptomForm";
import { useConsultations } from "@/hooks/useConsultations";
import { requestDiagnosis } from "@/lib/api-client";
import type { Consultation, ConsultationInput } from "@/lib/types";

export default function HomePage() {
  const { consultations, addConsultation, removeConsultation, clearConsultations } =
    useConsultations();

  const [active, setActive] = useState<Consultation | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<ConsultationInput | null>(null);

  function startNewConsultation() {
    setActive(null);
    setError(null);
    const field = document.getElementById("symptoms");
    field?.scrollIntoView({ behavior: "smooth", block: "center" });
    field?.focus({ preventScroll: true });
  }

  async function handleSubmit(input: ConsultationInput) {
    setLoading(true);
    setError(null);
    setLastInput(input);

    try {
      const { report, mode } = await requestDiagnosis(input);
      const consultation: Consultation = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        input,
        report,
      };
      setActive(consultation);
      setIsDemo(mode === "demo");
      addConsultation(consultation);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Ocurrió un error inesperado.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Saltar al contenido
      </a>
      <Header />

      <main id="contenido" className="mx-auto max-w-6xl px-6 pt-10 pb-16">
        <section className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            Triaje asistido por IA
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Entendé tus síntomas antes de la consulta
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Describí lo que sentís en tus palabras. Vitalis organiza esa información en
            un reporte claro con posibles causas, recomendaciones generales y señales de
            alarma para conversar mejor con tu médico.
          </p>
        </section>

        <div className="mt-8">
          <DisclaimerBanner />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <SymptomForm onSubmit={handleSubmit} loading={loading} />
            <HistoryPanel
              consultations={consultations}
              activeId={active?.id}
              onSelect={(item) => {
                setActive(item);
                setError(null);
              }}
              onRemove={removeConsultation}
              onClear={() => {
                clearConsultations();
                setActive(null);
              }}
            />
          </div>

          <div
            aria-live="polite"
            aria-busy={loading}
            className="space-y-6 lg:sticky lg:top-24 lg:self-start"
          >
            {loading && <ReportSkeleton />}
            {!loading && error && (
              <ErrorAlert
                message={error}
                onRetry={lastInput ? () => handleSubmit(lastInput) : undefined}
              />
            )}
            {!loading && !error && active && (
              <ReportView
                consultation={active}
                isDemo={isDemo}
                onNewConsultation={startNewConsultation}
              />
            )}
            {!loading && !error && !active && <EmptyState />}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/70 bg-white/60">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-slate-500">
          Vitalis · proyecto demostrativo de triaje con IA. No almacena datos en
          servidores: el historial vive en tu navegador.
        </div>
      </footer>
    </div>
  );
}
