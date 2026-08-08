import assert from "node:assert/strict";
import { test } from "node:test";
import { formatRelativeTime } from "../src/lib/relative-time.ts";

const NOW = new Date("2026-08-08T12:00:00Z").getTime();

function agoIso(ms: number): string {
  return new Date(NOW - ms).toISOString();
}

test("muestra 'recién' para menos de un minuto", () => {
  assert.equal(formatRelativeTime(agoIso(30_000), NOW), "recién");
});

test("usa minutos dentro de la primera hora", () => {
  assert.equal(formatRelativeTime(agoIso(5 * 60_000), NOW), "hace 5 minutos");
});

test("usa horas dentro del día", () => {
  assert.equal(formatRelativeTime(agoIso(3 * 3_600_000), NOW), "hace 3 horas");
});

test("usa la forma natural para el día anterior", () => {
  assert.equal(formatRelativeTime(agoIso(24 * 3_600_000), NOW), "ayer");
});

test("escala a meses", () => {
  assert.equal(formatRelativeTime(agoIso(60 * 24 * 3_600_000), NOW), "hace 2 meses");
});
