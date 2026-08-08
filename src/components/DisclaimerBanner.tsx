import { DISCLAIMER } from "@/lib/constants";

export function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div
      role="note"
      className={`flex gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 text-amber-900 ${
        compact ? "px-4 py-3" : "px-5 py-4"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 h-5 w-5 shrink-0"
        aria-hidden
      >
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
      <p className={compact ? "text-xs leading-relaxed" : "text-sm leading-relaxed"}>
        <span className="font-semibold">Aviso importante. </span>
        {DISCLAIMER}
      </p>
    </div>
  );
}
