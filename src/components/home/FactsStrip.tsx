import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/hooks/useSettings';
import type { Course } from '@/types/content';
import { Icon, type IconName } from '@/components/ui/Icon';

/**
 * Answers a first-time visitor's questions in one row: what is taught, what it
 * costs, how long it takes, and where. Every number is calculated from the
 * real course list; nothing is invented.
 */
export function FactsStrip({ courses }: { courses: Course[] | undefined }) {
  const { t, num, pickL } = useI18n();
  const s = useSettings();
  if (!courses?.length) return null;

  const fees = courses.map((c) => c.joining_fee).filter((f) => f > 0);
  const classes = courses.map((c) => c.total_classes);
  const address = pickL(s, 'address');
  // Short form for the strip: the last two parts of the address (area, city).
  const parts = address.text.split(/[,\n]/).map((x) => x.trim()).filter(Boolean);
  const shortAddress = parts.length > 2 ? parts.slice(-2).join(', ') : address.text;

  const facts: Array<{ icon: IconName; label: string; value: string; lang?: string; to: string }> = [
    { icon: 'layers', label: t.facts.teach, value: t.facts.teachValue(num(courses.length)), to: '/courses' },
  ];
  if (fees.length) facts.push({ icon: 'bolt', label: t.facts.fee, value: t.facts.feeValue(num(Math.min(...fees)), num(Math.max(...fees))), to: '/courses' });
  facts.push({ icon: 'calendar', label: t.facts.length, value: t.facts.lengthValue(num(Math.min(...classes)), num(Math.max(...classes))), to: '/courses' });
  facts.push({ icon: 'pin', label: t.facts.where, value: address.text ? address.text : t.facts.whereFallback, lang: address.text ? address.lang : undefined, to: '/contact' });

  return (
    <section aria-label={t.facts.label} className="relative border-b border-line bg-white">
      <div className="container-x">
        <ul className="grid divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {facts.map((f, i) => (
            <li key={f.label} className={i % 2 === 1 ? 'sm:border-l sm:border-line lg:border-l-0' : undefined}>
              <Link to={f.to} className="group flex h-full items-start gap-3 py-4 sm:px-5 sm:py-5 lg:first:pl-0">
                <Icon name={f.icon} className="mt-1 h-5 w-5 shrink-0 text-trace-dark" />
                <span>
                  <span className="block text-[14px] text-ink-muted">{f.label}</span>
                  <span className="line-clamp-2 block font-medium text-ink group-hover:text-trace-dark" lang={f.lang} title={f.label === t.facts.where ? address.text : undefined}>
                    {f.label === t.facts.where && address.text ? shortAddress : f.value}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
