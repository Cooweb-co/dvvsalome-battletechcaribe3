import assert from "node:assert/strict";
import { test } from "node:test";
import { checkRateLimit, getClientIdentifier } from "../src/lib/rate-limit.ts";

/** Cada test usa su propia IP para no contaminar el contador compartido. */
let siguiente = 0;
function nuevaIp(): string {
  siguiente += 1;
  return `10.0.0.${siguiente}`;
}

test("permite las primeras ocho consultas del minuto", () => {
  const ip = nuevaIp();
  for (let intento = 1; intento <= 8; intento += 1) {
    assert.equal(checkRateLimit(ip).allowed, true, `falló en el intento ${intento}`);
  }
});

test("bloquea la novena e indica cuánto esperar", () => {
  const ip = nuevaIp();
  for (let intento = 0; intento < 8; intento += 1) checkRateLimit(ip);

  const result = checkRateLimit(ip);
  assert.equal(result.allowed, false);
  assert.ok(result.retryAfterSeconds > 0 && result.retryAfterSeconds <= 60);
});

test("cuenta cada IP por separado", () => {
  const saturada = nuevaIp();
  for (let intento = 0; intento < 9; intento += 1) checkRateLimit(saturada);

  assert.equal(checkRateLimit(saturada).allowed, false);
  assert.equal(checkRateLimit(nuevaIp()).allowed, true);
});

test("toma la primera IP de x-forwarded-for", () => {
  const request = new Request("https://vitalis.test/api/diagnose", {
    headers: { "x-forwarded-for": "203.0.113.7, 70.41.3.18" },
  });
  assert.equal(getClientIdentifier(request), "203.0.113.7");
});

test("usa un identificador genérico si no hay cabecera de origen", () => {
  const request = new Request("https://vitalis.test/api/diagnose");
  assert.equal(getClientIdentifier(request), "anonimo");
});
