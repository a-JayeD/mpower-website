import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/utils/cn';

/**
 * Home-page section on the "signal path": a vertical trace runs down the
 * left edge of the page, and each section heading sits on a node that
 * lights up once when the section scrolls into view.
 */
export function Section({ id, title, intro, action, children, tone = 'light', className }: {
  id: string; title: string; intro?: ReactNode; action?: { to: string; label: string };
  children: ReactNode; tone?: 'light' | 'white' | 'dark'; className?: string;
}) {
  const [ref, lit] = useInView<HTMLDivElement>();
  const dark = tone === 'dark';
  return (
    <section aria-labelledby={`${id}-title`}
      className={cn('relative', tone === 'white' && 'bg-white', dark && 'on-dark tech-grid bg-board text-white', className)}>
      <div className="container-x relative py-14 sm:py-20">
        {/* rail */}
        <span aria-hidden className={cn('absolute bottom-0 top-0 left-[13px] w-px sm:left-[21px]', dark ? 'bg-board-line' : 'bg-line')} />
        {lit && <span aria-hidden className={cn('rail-signal absolute left-[13px] top-0 h-[4.6rem] w-px origin-top sm:left-[21px] sm:h-[6.1rem]', dark ? 'bg-trace-bright' : 'bg-trace')} />}
        <div ref={ref} className="relative pl-8 sm:pl-12">
          <span aria-hidden className={cn(
            'absolute left-[-13.5px] top-[0.55rem] h-3.5 w-3.5 rounded-full border-2 transition-colors duration-500 sm:left-[-17.5px] sm:top-[0.7rem]',
            lit ? (dark ? 'node-pulse border-trace-bright bg-trace-bright' : 'node-pulse border-trace bg-trace')
              : (dark ? 'border-trace-bright bg-board' : 'border-ink-muted/60 bg-paper'),
          )} />
          <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div className="max-w-2xl">
              <h2 id={`${id}-title`} className={cn('text-[1.7rem] font-semibold leading-tight sm:text-[2.1rem]', dark && 'text-white')}>{title}</h2>
              {intro && <p className={cn('mt-3 text-[17px]', dark ? 'text-white/75' : 'text-ink-muted')}>{intro}</p>}
            </div>
            {action && (
              <Link to={action.to} className={cn('font-medium underline underline-offset-4', dark ? 'text-trace-bright decoration-trace-bright/40 hover:decoration-trace-bright' : 'text-trace-dark decoration-trace/40 hover:decoration-trace-dark')}>
                {action.label}
              </Link>
            )}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
