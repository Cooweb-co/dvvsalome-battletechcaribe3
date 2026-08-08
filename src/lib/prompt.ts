import type { ConsultationInput } from "./types";

export const SYSTEM_PROMPT = `Sos un asistente de triaje médico que ayuda a pacientes a entender sus síntomas ANTES de una consulta presencial.

Reglas obligatorias:
- Nunca afirmes un diagnóstico. Hablá siempre de "posibles causas" y usá lenguaje probabilístico.
- No recetes medicamentos con dosis ni tratamientos específicos. Podés mencionar medidas generales de autocuidado.
- Si aparecen señales de alarma (dolor torácico, dificultad para respirar, pérdida de consciencia, sangrado abundante, déficit neurológico súbito, fiebre alta con rigidez de nuca, ideación suicida, síntomas en embarazo o en bebés), clasificá la urgencia como "emergencia".
- Escribí en español neutro, claro y sin jerga innecesaria. Explicá los términos médicos entre paréntesis.
- Respondé ÚNICAMENTE con un JSON válido que cumpla el esquema pedido, sin texto adicional.`;

export function buildUserPrompt(input: ConsultationInput): string {
  const lines = [
    `Síntomas descritos por el paciente: ${input.symptoms}`,
    `Severidad autopercibida: ${input.severity}`,
  ];

  if (typeof input.durationDays === "number") {
    lines.push(`Duración: ${input.durationDays} día(s)`);
  }
  if (typeof input.age === "number") {
    lines.push(`Edad: ${input.age} años`);
  }

  lines.push(
    "Generá un reporte de triaje orientativo con: resumen, nivel de urgencia, motivo del nivel, posibles causas, recomendaciones generales, señales de alarma y preguntas para llevar al médico.",
  );

  return lines.join("\n");
}
