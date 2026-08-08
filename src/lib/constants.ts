import type { Severity, Urgency } from "./types";

export const DISCLAIMER =
  "Esta herramienta ofrece información orientativa generada por inteligencia artificial. No constituye un diagnóstico médico ni sustituye la valoración de un profesional de la salud. Ante síntomas graves o que empeoran, acudí a un servicio de urgencias.";

export const SEVERITY_META: Record<
  Severity,
  { label: string; hint: string; dot: string; ring: string }
> = {
  leve: {
    label: "Leve",
    hint: "Molesto, pero no interfiere con tu día",
    dot: "bg-emerald-500",
    ring: "peer-checked:border-emerald-500 peer-checked:bg-emerald-50",
  },
  moderado: {
    label: "Moderado",
    hint: "Te limita algunas actividades",
    dot: "bg-amber-500",
    ring: "peer-checked:border-amber-500 peer-checked:bg-amber-50",
  },
  intenso: {
    label: "Intenso",
    hint: "Difícil de tolerar o dormir",
    dot: "bg-orange-500",
    ring: "peer-checked:border-orange-500 peer-checked:bg-orange-50",
  },
  severo: {
    label: "Severo",
    hint: "Incapacitante o en aumento rápido",
    dot: "bg-rose-500",
    ring: "peer-checked:border-rose-500 peer-checked:bg-rose-50",
  },
};

export const URGENCY_META: Record<
  Urgency,
  { label: string; description: string; className: string }
> = {
  autocuidado: {
    label: "Autocuidado en casa",
    description: "Podés manejarlo con medidas generales y observación.",
    className: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  },
  consulta: {
    label: "Consulta médica programada",
    description: "Conviene una valoración profesional en los próximos días.",
    className: "bg-sky-50 text-sky-800 ring-sky-200",
  },
  urgencia: {
    label: "Atención en 24 horas",
    description: "Buscá valoración médica hoy o mañana.",
    className: "bg-amber-50 text-amber-900 ring-amber-200",
  },
  emergencia: {
    label: "Emergencia · atención inmediata",
    description: "Acudí ya a urgencias o llamá a emergencias.",
    className: "bg-rose-50 text-rose-800 ring-rose-200",
  },
};

export const LIKELIHOOD_CLASS: Record<string, string> = {
  alta: "bg-slate-900 text-white",
  media: "bg-slate-200 text-slate-700",
  baja: "bg-slate-100 text-slate-500",
};

export const HISTORY_STORAGE_KEY = "vitalis:consultations";
export const MAX_HISTORY_ITEMS = 20;
