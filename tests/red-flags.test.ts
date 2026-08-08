import assert from "node:assert/strict";
import { test } from "node:test";
import { detectRedFlags } from "../src/lib/red-flags.ts";

test("detecta dolor en el pecho", () => {
  const flags = detectRedFlags("Tengo un dolor fuerte en el pecho desde hace una hora");
  assert.deepEqual(flags, ["Dolor en el pecho"]);
});

test("detecta dificultad respiratoria con distintas redacciones", () => {
  for (const texto of [
    "me falta el aire al caminar",
    "tengo dificultad para respirar",
    "siento ahogo",
  ]) {
    assert.ok(
      detectRedFlags(texto).includes("Dificultad para respirar"),
      `sin detección para: ${texto}`,
    );
  }
});

test("detecta varias señales en un mismo texto", () => {
  const flags = detectRedFlags(
    "Dolor torácico y no puedo respirar bien, casi me desmayo",
  );
  assert.equal(flags.length, 3);
});

test("ignora texto sin señales de alarma", () => {
  assert.deepEqual(detectRedFlags("Tengo un poco de tos y estornudos"), []);
});

test("ignora texto demasiado corto", () => {
  assert.deepEqual(detectRedFlags("ah"), []);
});

test("es insensible a mayúsculas y funciona sin tildes", () => {
  assert.ok(detectRedFlags("DOLOR TORACICO").includes("Dolor en el pecho"));
});
