import { NextResponse } from "next/server";
import { AiError, generateTriageReport, isAiConfigured } from "@/lib/ai";
import { buildMockReport } from "@/lib/mock-report";
import { consultationInputSchema } from "@/lib/schema";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
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
    return NextResponse.json({
      report: buildMockReport(parsed.data),
      mode: "demo" as const,
    });
  }

  try {
    const report = await generateTriageReport(parsed.data);
    return NextResponse.json({ report, mode: "ai" as const });
  } catch (error) {
    if (error instanceof AiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("[diagnose] error inesperado", error);
    return NextResponse.json(
      { error: "Ocurrió un error inesperado al generar el reporte." },
      { status: 500 },
    );
  }
}
