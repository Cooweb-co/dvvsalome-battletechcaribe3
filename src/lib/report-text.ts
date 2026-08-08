import { DISCLAIMER, SEVERITY_META, URGENCY_META } from "./constants";
import type { Consultation } from "./types";

/** Serializa el reporte a texto plano para copiar o imprimir y llevar a consulta. */
export function reportToText(consultation: Consultation): string {
  const { input, report, createdAt } = consultation;
  const date = new Date(createdAt).toLocaleString("es-CO", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const lines = [
    "REPORTE ORIENTATIVO DE SÍNTOMAS — Vitalis",
    date,
    "",
    "SÍNTOMAS DESCRITOS",
    input.symptoms,
    "",
    `Severidad autopercibida: ${SEVERITY_META[input.severity].label}`,
  ];

  if (typeof input.durationDays === "number") {
    lines.push(`Duración: ${input.durationDays} día(s)`);
  }
  if (typeof input.age === "number") {
    lines.push(`Edad: ${input.age} años`);
  }
  if (input.history) {
    lines.push(`Antecedentes y medicación: ${input.history}`);
  }

  lines.push(
    "",
    `NIVEL DE URGENCIA: ${URGENCY_META[report.urgency].label}`,
    report.urgencyReason,
    "",
    "RESUMEN",
    report.summary,
    "",
    "POSIBLES CAUSAS",
    ...report.possibleCauses.map(
      (cause) =>
        `- ${cause.name} (probabilidad ${cause.likelihood}): ${cause.explanation}`,
    ),
    "",
    "RECOMENDACIONES GENERALES",
    ...report.recommendations.map((item) => `- ${item}`),
  );

  if (report.redFlags.length > 0) {
    lines.push(
      "",
      "SEÑALES DE ALARMA — CONSULTAR DE INMEDIATO",
      ...report.redFlags.map((item) => `- ${item}`),
    );
  }

  if (report.questionsForDoctor.length > 0) {
    lines.push(
      "",
      "PREGUNTAS PARA EL MÉDICO",
      ...report.questionsForDoctor.map((item) => `- ${item}`),
    );
  }

  lines.push("", "AVISO", DISCLAIMER);

  return lines.join("\n");
}

export function downloadReport(consultation: Consultation) {
  const blob = new Blob([reportToText(consultation)], {
    type: "text/plain;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = consultation.createdAt.slice(0, 10);

  link.href = url;
  link.download = `reporte-vitalis-${stamp}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}
