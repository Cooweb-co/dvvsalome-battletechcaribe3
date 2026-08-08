import type { ConsultationInput, TriageReport } from "./types";

export interface DiagnoseResult {
  report: TriageReport;
  mode: "ai" | "demo";
}

export async function requestDiagnosis(
  input: ConsultationInput,
): Promise<DiagnoseResult> {
  let response: Response;
  try {
    response = await fetch("/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error("Sin conexión con el servidor. Revisá tu red y reintentá.");
  }

  const data = (await response.json().catch(() => null)) as
    | (Partial<DiagnoseResult> & { error?: string; issues?: string[] })
    | null;

  if (!response.ok || !data?.report) {
    const detail = data?.issues?.[0] ?? data?.error;
    throw new Error(detail ?? "No pudimos generar el reporte. Intentá de nuevo.");
  }

  return { report: data.report, mode: data.mode ?? "ai" };
}
