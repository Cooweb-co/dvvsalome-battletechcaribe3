import { HISTORY_STORAGE_KEY, MAX_HISTORY_ITEMS } from "./constants";
import type { Consultation } from "./types";

const EMPTY: Consultation[] = [];

const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedValue: Consultation[] = EMPTY;

function parse(raw: string | null): Consultation[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Consultation[]) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(HISTORY_STORAGE_KEY);
  } catch {
    return null;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** Devuelve siempre la misma referencia mientras el contenido no cambie. */
export function getSnapshot(): Consultation[] {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = parse(raw);
  }
  return cachedValue;
}

export function getServerSnapshot(): Consultation[] {
  return EMPTY;
}

function write(next: Consultation[]) {
  const serialized = JSON.stringify(next);
  cachedRaw = serialized;
  cachedValue = next;
  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, serialized);
  } catch {
    // Almacenamiento lleno o bloqueado: el historial queda solo en memoria.
  }
  emit();
}

export function addConsultation(consultation: Consultation) {
  write([consultation, ...getSnapshot()].slice(0, MAX_HISTORY_ITEMS));
}

export function removeConsultation(id: string) {
  write(getSnapshot().filter((item) => item.id !== id));
}

export function clearConsultations() {
  write(EMPTY);
}
