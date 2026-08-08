"use client";

import { SEVERITY_META } from "@/lib/constants";
import { SEVERITY_LEVELS, type Severity } from "@/lib/types";

interface Props {
  value: Severity;
  onChange: (value: Severity) => void;
  disabled?: boolean;
}

export function SeveritySelector({ value, onChange, disabled }: Props) {
  return (
    <fieldset disabled={disabled} className="disabled:opacity-60">
      <legend className="text-sm font-medium text-slate-800">
        ¿Qué tan intensos son tus síntomas?
      </legend>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SEVERITY_LEVELS.map((level) => {
          const meta = SEVERITY_META[level];
          return (
            <label key={level} className="cursor-pointer">
              <input
                type="radio"
                name="severity"
                value={level}
                checked={value === level}
                onChange={() => onChange(level)}
                className="peer sr-only"
              />
              <span
                className={`flex h-full flex-col gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 transition peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/40 hover:border-slate-300 ${meta.ring}`}
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
                <span className="text-[11px] leading-snug text-slate-500">
                  {meta.hint}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
