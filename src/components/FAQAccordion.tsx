import { useId, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import type { Faq } from '@/types/content';
import { RichText } from '@/utils/text';
import { cn } from '@/utils/cn';
import { Icon } from './ui/Icon';

/** WAI-ARIA accordion: each question is a button that controls its answer region. */
export function FAQAccordion({ faqs, headingLevel = 3, onDark }: { faqs: Faq[]; headingLevel?: 2 | 3; onDark?: boolean }) {
  const { pickL } = useI18n();
  const base = useId();
  const [open, setOpen] = useState<Set<string>>(new Set());
  const H = headingLevel === 2 ? 'h2' : 'h3';
  const toggle = (id: string) => setOpen((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });

  return (
    <div className={cn('divide-y rounded-lg border', onDark ? 'divide-white/10 border-white/15' : 'divide-line border-line bg-white')}>
      {faqs.map((f) => {
        const q = pickL(f, 'question');
        const a = pickL(f, 'answer');
        const expanded = open.has(f.id);
        const btn = `${base}-${f.id}-q`;
        const panel = `${base}-${f.id}-a`;
        return (
          <div key={f.id}>
            <H className="m-0 text-[17px] font-medium" lang={q.lang}>
              <button id={btn} type="button" aria-expanded={expanded} aria-controls={panel} onClick={() => toggle(f.id)}
                className={cn('flex min-h-[56px] w-full items-center gap-4 px-5 py-3 text-left font-sans',
                  onDark ? 'text-white hover:text-trace-bright' : 'text-ink hover:text-trace-dark')}>
                <span aria-hidden className={cn('h-2.5 w-2.5 shrink-0 rounded-full border-2 transition-colors',
                  expanded ? 'border-trace bg-trace' : onDark ? 'border-white/40' : 'border-ink-muted/50')} />
                <span className="flex-1">{q.text}</span>
                <Icon name="down" className={cn('h-5 w-5 shrink-0 transition-transform', expanded && 'rotate-180')} />
              </button>
            </H>
            <div id={panel} role="region" aria-labelledby={btn} hidden={!expanded}
              className={cn('px-5 pb-5 pl-[3.1rem] text-[16px]', onDark ? 'text-white/75' : 'text-ink-soft')}>
              <RichText text={a.text} lang={a.lang} className="space-y-3" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
