/** Shown when an item has no photo: a small circuit-board tile instead of an empty grey box. */
export function BoardPlaceholder({ label, ratio = '16/9' }: { label?: string; ratio?: string }) {
  return (
    <div className="tech-grid relative flex items-center justify-center overflow-hidden bg-board" style={{ aspectRatio: ratio }} role={label ? 'img' : undefined} aria-label={label}>
      <svg viewBox="0 0 200 112" className="h-full w-full text-board-line" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M0 30h50l12 12h40" /><path d="M0 82h70l10-10h22" /><path d="M138 42h22l14-14h26" /><path d="M138 70h30l10 12h22" />
          <rect x="102" y="32" width="36" height="48" rx="3" stroke="#1AAFD8" strokeOpacity=".7" />
        </g>
        <g fill="#0A1A33" stroke="#1AAFD8" strokeOpacity=".7" strokeWidth="1.5">
          <circle cx="50" cy="30" r="3" /><circle cx="70" cy="82" r="3" /><circle cx="174" cy="28" r="3" /><circle cx="168" cy="70" r="3" />
        </g>
      </svg>
    </div>
  );
}
