import { NextResponse } from "next/server";
import { AiError, generateTriageReport, isAiConfigured } from "@/lib/ai";
import { buildMockReport } from "@/lib/mock-report";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { consultationInputSchema } from "@/lib/schema";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BODY_BYTES = 8_000;

/** Los reportes contienen datos de salud: no deben quedar cacheados en el camino. */
const NO_STORE = { "Cache-Control": "no-store, private" };

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { error: "El contenido debe enviarse como application/json." },
      { status: 415 },
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "La consulta es demasiado extensa." },
      { status: 413 },
    );
  }

  const limit = checkRateLimit(getClientIdentifier(request));
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `Alcanzaste el límite de consultas. Probá de nuevo en ${limit.retryAfterSeconds} segundos.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la petición no es JSON válido." },
      { status: 400 },
    );
  }

  const parsed = consultationInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Revisá los datos del formulario.",
        issues: parsed.error.issues.map((issue) => issue.message),
      },
      { status: 422 },
    );
  }

  if (!isAiConfigured()) {
    return NextResponse.json(
      { report: buildMockReport(parsed.data), mode: "demo" as const },
      { headers: NO_STORE },
    );
  }

  try {
    const report = await generateTriageReport(parsed.data);
    return NextResponse.json(
      { report, mode: "ai" as const },
      { headers: NO_STORE },
    );
  } catch (error) {
    if (error instanceof AiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    // Solo el mensaje: los síntomas son datos de salud y no deben quedar en logs.
    console.error(
      "[diagnose] error inesperado:",
      error instanceof Error ? error.message : "desconocido",
    );
    return NextResponse.json(
      { error: "Ocurrió un error inesperado al generar el reporte." },
      { status: 500 },
    );
  }
}
