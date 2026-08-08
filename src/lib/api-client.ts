import type { ConsultationInput, TriageReport } from "./types";

/** Algo por encima del timeout del servidor, para que gane el mensaje del backend. */
const CLIENT_TIMEOUT_MS = 35_000;

export interface DiagnoseResult {
  report: TriageReport;
  mode: "ai" | "demo";
}

export async function requestDiagnosis(
  input: ConsultationInput,
): Promise<DiagnoseResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch("/api/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: controller.signal,
    });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    throw new Error(
      aborted
        ? "El análisis tardó demasiado. Probá de nuevo en unos segundos."
        : "Sin conexión con el servidor. Revisá tu red y reintentá.",
    );
  } finally {
    clearTimeout(timeout);
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
