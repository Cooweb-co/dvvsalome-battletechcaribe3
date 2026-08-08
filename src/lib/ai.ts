import { triageReportSchema } from "./schema";
import { buildUserPrompt, SYSTEM_PROMPT } from "./prompt";
import type { ConsultationInput, TriageReport } from "./types";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const TIMEOUT_MS = 30_000;

export class AiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "AiError";
  }
}

export function isAiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

const RESPONSE_FORMAT = {
  type: "json_schema",
  json_schema: {
    name: "triage_report",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      required: [
        "summary",
        "urgency",
        "urgencyReason",
        "possibleCauses",
        "recommendations",
        "redFlags",
        "questionsForDoctor",
      ],
      properties: {
        summary: { type: "string" },
        urgency: {
          type: "string",
          enum: ["autocuidado", "consulta", "urgencia", "emergencia"],
        },
        urgencyReason: { type: "string" },
        possibleCauses: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["name", "explanation", "likelihood"],
            properties: {
              name: { type: "string" },
              explanation: { type: "string" },
              likelihood: { type: "string", enum: ["baja", "media", "alta"] },
            },
          },
        },
        recommendations: { type: "array", items: { type: "string" } },
        redFlags: { type: "array", items: { type: "string" } },
        questionsForDoctor: { type: "array", items: { type: "string" } },
      },
    },
  },
} as const;

export async function generateTriageReport(
  input: ConsultationInput,
): Promise<TriageReport> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(OPENAI_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(input) },
        ],
        response_format: RESPONSE_FORMAT,
      }),
    });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    throw new AiError(
      aborted
        ? "El análisis tardó demasiado. Probá de nuevo en unos segundos."
        : "No pudimos conectar con el servicio de IA.",
      504,
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const status = response.status === 429 ? 429 : 502;
    throw new AiError(
      response.status === 429
        ? "El servicio de IA está saturado. Esperá un momento y reintentá."
        : "El servicio de IA respondió con un error.",
      status,
    );
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new AiError("La IA devolvió una respuesta vacía.", 502);
  }

  const parsed = triageReportSchema.safeParse(JSON.parse(content));
  if (!parsed.success) {
    throw new AiError("La IA devolvió un reporte con formato inesperado.", 502);
  }

  return parsed.data;
}
