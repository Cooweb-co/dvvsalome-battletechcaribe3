export const SEVERITY_LEVELS = ["leve", "moderado", "intenso", "severo"] as const;

export type Severity = (typeof SEVERITY_LEVELS)[number];

export const URGENCY_LEVELS = ["autocuidado", "consulta", "urgencia", "emergencia"] as const;

export type Urgency = (typeof URGENCY_LEVELS)[number];

export interface ConsultationInput {
  symptoms: string;
  severity: Severity;
  durationDays?: number;
  age?: number;
}

export interface PossibleCause {
  name: string;
  explanation: string;
  likelihood: "baja" | "media" | "alta";
}

export interface TriageReport {
  summary: string;
  urgency: Urgency;
  urgencyReason: string;
  possibleCauses: PossibleCause[];
  recommendations: string[];
  redFlags: string[];
  questionsForDoctor: string[];
}

export interface Consultation {
  id: string;
  createdAt: string;
  input: ConsultationInput;
  report: TriageReport;
}
