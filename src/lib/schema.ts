import { z } from "zod";
import { SEVERITY_LEVELS, URGENCY_LEVELS } from "./types.ts";

export const consultationInputSchema = z.object({
  symptoms: z
    .string()
    .trim()
    .min(15, "Describí tus síntomas con al menos 15 caracteres.")
    .max(1500, "La descripción no puede superar los 1500 caracteres."),
  severity: z.enum(SEVERITY_LEVELS),
  durationDays: z.number().int().min(0).max(3650).optional(),
  age: z.number().int().min(0).max(120).optional(),
});

export const possibleCauseSchema = z.object({
  name: z.string(),
  explanation: z.string(),
  likelihood: z.enum(["baja", "media", "alta"]),
});

export const triageReportSchema = z.object({
  summary: z.string(),
  urgency: z.enum(URGENCY_LEVELS),
  urgencyReason: z.string(),
  possibleCauses: z.array(possibleCauseSchema).min(1).max(5),
  recommendations: z.array(z.string()).min(1).max(8),
  redFlags: z.array(z.string()).max(8),
  questionsForDoctor: z.array(z.string()).max(6),
});
