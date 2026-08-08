"use client";

import { DisclaimerBanner } from "./DisclaimerBanner";
import { ReportActions } from "./ReportActions";
import { LIKELIHOOD_CLASS, SEVERITY_META, URGENCY_META } from "@/lib/constants";
import type { Consultation } from "@/lib/types";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h4 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
        {title}
      </h4>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function ReportView({
  consultation,
  isDemo,
  onNewConsultation,
}: {
  consultation: Consultation;
  isDemo?: boolean;
  onNewConsultation?: () => void;
}) {
  const { report, input, createdAt } = consultation;
  const urgency = URGENCY_META[report.urgency];

  return (
    <article className="card animate-rise p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">
            Reporte orientativo
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {new Date(createdAt).toLocaleString("es-CO", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
            {" · severidad "}
            {SEVERITY_META[input.severity].label.toLowerCase()}
          </p>
        </div>
        {isDemo && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
            Modo demo · sin IA conectada
          </span>
        )}
      </div>

      <div className={`mt-4 rounded-2xl px-4 py-3 ring-1 ${urgency.className}`}>
        <p className="text-sm font-semibold">{urgency.label}</p>
        <p className="mt-1 text-xs leading-relaxed opacity-90">
          {report.urgencyReason}
        </p>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-slate-700">{report.summary}</p>

      <Section title="Posibles causas">
        <ul className="space-y-3">
          {report.possibleCauses.map((cause) => (
            <li
              key={cause.name}
              className="rounded-xl border border-slate-200 bg-white/70 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{cause.name}</p>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    LIKELIHOOD_CLASS[cause.likelihood] ?? LIKELIHOOD_CLASS.baja
                  }`}
                >
                  probabilidad {cause.likelihood}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                {cause.explanation}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Recomendaciones generales">
        <ul className="space-y-2">
          {report.recommendations.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm text-slate-700">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              {item}
            </li>
          ))}
        </ul>
      </Section>

      {report.redFlags.length > 0 && (
        <Section title="Señales de alarma · consultá de inmediato">
          <ul className="grid gap-2 sm:grid-cols-2">
            {report.redFlags.map((item) => (
              <li
                key={item}
                className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800"
              >
                {item}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {report.questionsForDoctor.length > 0 && (
        <Section title="Preguntas para tu médico">
          <ul className="space-y-2">
            {report.questionsForDoctor.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600"
              >
                {item}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <div className="mt-6">
        <DisclaimerBanner compact />
      </div>

      <div className="mt-4">
        <ReportActions
          consultation={consultation}
          onNewConsultation={onNewConsultation}
        />
      </div>
    </article>
  );
}
