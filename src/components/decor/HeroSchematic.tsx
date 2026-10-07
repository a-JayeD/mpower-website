import { useMemo } from 'react';
import { useI18n } from '@/lib/i18n';

const LABEL_Y = [62, 150, 238, 326];
const PIN_Y = [150, 180, 210, 240];

function prefersMotion() {
  return typeof window !== 'undefined' && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/**
 * The hero's one orchestrated moment: an IC package labelled with the center's
 * name, whose output pins are routed as PCB traces to the courses it teaches.
 * Traces draw in, a signal pulse runs along each, and the end nodes light.
 * The labels are real course names from the database.
 */
export function HeroSchematic({ labels }: { labels: Array<{ text: string; lang: string }> }) {
  const { t } = useI18n();
  const motion = useMemo(prefersMotion, []);
  const items = labels.slice(0, 4);
  const n = items.length;
  const traces = items.map((l, i) => {
    const ly = n < 4 ? LABEL_Y[i] + (4 - n) * 44 : LABEL_Y[i];
    const py = PIN_Y[i];
    const d = Math.abs(ly - py);
    const path = `M200 ${py} H232 L${232 + d} ${ly} H304`;
    const text = l.text.length > 24 ? `${l.text.slice(0, 23)}…` : l.text;
    return { ...l, ly, py, path, text };
  });

  return (
    <svg viewBox="0 0 520 400" className="h-auto w-full" role="img" aria-label={t.hero.schematicLabel}>
      {/* input side: supply traces entering the chip */}
      <g stroke="#25467A" strokeWidth="2" fill="none">
        <path d="M0 150H40l14 14h16" /><path d="M0 250H44l-14-14H70" /><path d="M0 200h70" />
      </g>
      <g fill="#0A1A33" stroke="#25467A" strokeWidth="2">
        <circle cx="40" cy="150" r="4" /><circle cx="44" cy="250" r="4" />
      </g>

      {/* chip */}
      <rect x="70" y="110" width="130" height="180" rx="10" fill="#10264A" stroke="#5BD3F2" strokeOpacity=".55" strokeWidth="2" />
      <circle cx="88" cy="128" r="4" fill="#25467A" />
      {[130, 160, 190, 220, 250, 270].map((y) => <rect key={`l${y}`} x="62" y={y} width="8" height="4" rx="1" fill="#25467A" />)}
      {PIN_Y.map((y) => <rect key={`r${y}`} x="200" y={y - 2} width="8" height="4" rx="1" fill="#5BD3F2" fillOpacity=".8" />)}
      <text x="135" y="196" textAnchor="middle" fill="#FFFFFF" fontFamily="IBM Plex Sans Condensed, sans-serif" fontWeight="600" fontSize="22" letterSpacing="1">{t.hero.chip}</text>
      <text x="135" y="220" textAnchor="middle" fill="#5BD3F2" fillOpacity=".75" fontFamily="IBM Plex Sans, sans-serif" fontSize="12">ENGINEERING</text>
      <circle cx="184" cy="274" r="4" fill="#22A867" className={motion ? 'animate-glow' : undefined} />

      {/* outputs: one trace per course */}
      {traces.map((tr, i) => (
        <g key={i}>
          <path d={tr.path} fill="none" stroke="#25467A" strokeWidth="2" />
          <path d={tr.path} fill="none" stroke="#1AAFD8" strokeWidth="2" pathLength={1} className="trace-draw"
            style={{ ['--len' as string]: 1, ['--delay' as string]: `${0.25 + i * 0.18}s` }} />
          {motion && (
            <circle r="3.5" fill="#5BD3F2" opacity="0">
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="1.6s" begin={`${2 + i * 0.25}s`} fill="freeze" />
              <animateMotion dur="1.6s" begin={`${2 + i * 0.25}s`} path={tr.path} fill="freeze" />
            </circle>
          )}
          <circle cx="310" cy={tr.ly} r="6" fill="#0A1A33" stroke="#5BD3F2" strokeWidth="2" />
          <circle cx="310" cy={tr.ly} r="2.5" fill="#5BD3F2" opacity={motion ? 0 : 1}>
            {motion && <animate attributeName="opacity" to="1" dur=".3s" begin={`${3.4 + i * 0.25}s`} fill="freeze" />}
          </circle>
          <text x="326" y={tr.ly + 5} fill="#FFFFFF" fontSize="15" fontFamily="IBM Plex Sans, Hind Siliguri, sans-serif" lang={tr.lang}>{tr.text}</text>
        </g>
      ))}
    </svg>
  );
}
