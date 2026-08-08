import assert from "node:assert/strict";
import { test } from "node:test";
import { consultationInputSchema, triageReportSchema } from "../src/lib/schema.ts";

test("acepta una entrada válida", () => {
  const result = consultationInputSchema.safeParse({
    symptoms: "Dolor de garganta al tragar desde hace tres días",
    severity: "moderado",
    durationDays: 3,
  });
  assert.equal(result.success, true);
});

test("rechaza descripciones demasiado cortas", () => {
  const result = consultationInputSchema.safeParse({
    symptoms: "me duele",
    severity: "leve",
  });
  assert.equal(result.success, false);
  assert.match(result.error!.issues[0].message, /15 caracteres/);
});

test("rechaza una severidad inexistente", () => {
  const result = consultationInputSchema.safeParse({
    symptoms: "Dolor de cabeza persistente desde ayer",
    severity: "catastrofico",
  });
  assert.equal(result.success, false);
});

test("recorta espacios sobrantes de los síntomas", () => {
  const result = consultationInputSchema.parse({
    symptoms: "   Fiebre alta y escalofríos hace dos días   ",
    severity: "intenso",
  });
  assert.equal(result.symptoms, "Fiebre alta y escalofríos hace dos días");
});

test("rechaza un reporte de la IA sin posibles causas", () => {
  const result = triageReportSchema.safeParse({
    summary: "resumen",
    urgency: "consulta",
    urgencyReason: "motivo",
    possibleCauses: [],
    recommendations: ["descansar"],
    redFlags: [],
    questionsForDoctor: [],
  });
  assert.equal(result.success, false);
});
