/**
 * Oscilloscope strip along the bottom of the hero: a flat line, a few square
 * clock pulses, then a sine — digital and analogue, the two halves of what is taught.
 */
export function Waveform({ className }: { className?: string }) {
  const sine = Array.from({ length: 9 }, (_, i) => {
    const x = 760 + i * 60;
    return `Q${x + 15} 12 ${x + 30} 36 T${x + 60} 36`;
  }).join(' ');
  const d = `M0 36 H160 V14 H210 V36 H260 V14 H310 V36 H360 V14 H410 V36 H460 V14 H510 V36 H580 L620 36 C660 36 680 36 700 36 H760 ${sine}`;
  return (
    <svg viewBox="0 0 1300 60" preserveAspectRatio="none" className={className} aria-hidden="true">
      <g stroke="#25467A" strokeWidth="1" strokeDasharray="2 6">
        <path d="M0 36H1300" />
      </g>
      <path d={d} fill="none" stroke="#1AAFD8" strokeWidth="2" vectorEffect="non-scaling-stroke"
        pathLength={1} className="trace-draw" style={{ ['--len' as string]: 1, ['--delay' as string]: '0.1s' }} />
    </svg>
  );
}
