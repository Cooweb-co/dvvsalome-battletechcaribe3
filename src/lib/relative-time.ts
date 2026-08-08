const formatter = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
];

/** "hace 5 minutos", "ayer", "hace 2 meses". */
export function formatRelativeTime(isoDate: string, now = Date.now()): string {
  const elapsed = now - new Date(isoDate).getTime();

  if (elapsed < 60_000) return "recién";

  for (const [unit, ms] of UNITS) {
    if (elapsed >= ms) {
      return formatter.format(-Math.floor(elapsed / ms), unit);
    }
  }

  return "recién";
}
