import type { ConsultationInput, TriageReport, Urgency } from "./types";

const URGENCY_BY_SEVERITY: Record<ConsultationInput["severity"], Urgency> = {
  leve: "autocuidado",
  moderado: "consulta",
  intenso: "urgencia",
  severo: "emergencia",
};

/**
 * Reporte de demostración usado cuando no hay credenciales de IA configuradas,
 * para que la interfaz sea navegable sin costo de API.
 */
export function buildMockReport(input: ConsultationInput): TriageReport {
  const urgency = URGENCY_BY_SEVERITY[input.severity];

  return {
    summary: `Reporte de demostración generado sin IA. Describiste: "${input.symptoms.slice(0, 160)}" con severidad ${input.severity}.`,
    urgency,
    urgencyReason:
      "El nivel se derivó de la severidad que indicaste, no de un análisis clínico real. Configurá una clave de IA para obtener el análisis completo.",
    possibleCauses: [
      {
        name: "Causa de ejemplo A",
        explanation:
          "Este bloque muestra cómo se presentan las posibles causas con su explicación en lenguaje simple.",
        likelihood: "media",
      },
      {
        name: "Causa de ejemplo B",
        explanation:
          "Cada causa incluye una probabilidad orientativa para ayudarte a priorizar la conversación con tu médico.",
        likelihood: "baja",
      },
    ],
    recommendations: [
      "Mantené hidratación y descanso adecuados.",
      "Registrá cuándo aparecen los síntomas y qué los empeora.",
      "Consultá a un profesional de la salud para una valoración real.",
    ],
    redFlags: [
      "Dificultad para respirar",
      "Dolor en el pecho",
      "Fiebre que no cede en 72 horas",
    ],
    questionsForDoctor: [
      "¿Qué estudios necesito para descartar causas serias?",
      "¿Qué señales deberían hacerme volver a consultar?",
    ],
  };
}
