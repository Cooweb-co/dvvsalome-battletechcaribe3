"use client";

import { useSyncExternalStore } from "react";
import {
  addConsultation,
  clearConsultations,
  getServerSnapshot,
  getSnapshot,
  removeConsultation,
  subscribe,
} from "@/lib/history-store";

export function useConsultations() {
  const consultations = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return {
    consultations,
    addConsultation,
    removeConsultation,
    clearConsultations,
  };
}
