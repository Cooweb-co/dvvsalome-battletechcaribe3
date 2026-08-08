import assert from "node:assert/strict";
import { test } from "node:test";
import { DISCLAIMER } from "../src/lib/constants.ts";
import { reportToText } from "../src/lib/report-text.ts";
import type { Consultation } from "../src/lib/types.ts";

const CONSULTATION: Consultation = {
  id: "1",
  createdAt: "2026-08-08T12:00:00.000Z",
  input: {
    symptoms: "Dolor de garganta al tragar hace tres días",
    severity: "moderado",
    durationDays: 3,
    age: 34,
    history: "hipertensión, tomo losartán",
  },
  report: {
    summary: "Cuadro compatible con una infección de vías respiratorias altas.",
    urgency: "consulta",
    urgencyReason: "Los síntomas persisten pero no hay señales de gravedad.",
    possibleCauses: [
      {
        name: "Faringitis viral",
        explanation: "Inflamación de la garganta por un virus común.",
        likelihood: "alta",
      },
    ],
    recommendations: ["Hidratarse bien", "Hacer gárgaras con agua tibia y sal"],
    redFlags: ["Dificultad para respirar"],
    questionsForDoctor: ["¿Necesito un cultivo de garganta?"],
  },
};

test("el reporte exportado siempre incluye el disclaimer", () => {
  assert.ok(reportToText(CONSULTATION).includes(DISCLAIMER));
});

test("incluye síntomas, causas, recomendaciones y preguntas", () => {
  const text = reportToText(CONSULTATION);
  assert.match(text, /Dolor de garganta al tragar/);
  assert.match(text, /Faringitis viral \(probabilidad alta\)/);
  assert.match(text, /- Hidratarse bien/);
  assert.match(text, /¿Necesito un cultivo de garganta\?/);
});

test("incluye los datos opcionales solo cuando existen", () => {
  const conTodo = reportToText(CONSULTATION);
  assert.match(conTodo, /Edad: 34 años/);
  assert.match(conTodo, /Antecedentes y medicación: hipertensión/);

  const sinOpcionales = reportToText({
    ...CONSULTATION,
    input: { symptoms: CONSULTATION.input.symptoms, severity: "leve" },
  });
  assert.doesNotMatch(sinOpcionales, /Edad:/);
  assert.doesNotMatch(sinOpcionales, /Antecedentes/);
});

test("omite las secciones vacías", () => {
  const text = reportToText({
    ...CONSULTATION,
    report: { ...CONSULTATION.report, redFlags: [], questionsForDoctor: [] },
  });
  assert.doesNotMatch(text, /SEÑALES DE ALARMA/);
  assert.doesNotMatch(text, /PREGUNTAS PARA EL MÉDICO/);
});
