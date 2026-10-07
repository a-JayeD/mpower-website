import type { ReactNode } from 'react';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/utils/cn';
import { Icon } from './Icon';

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('animate-pulse rounded-md bg-line/70', className)} />;
}

export function CardsSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  const { t } = useI18n();
  return (
    <div className={className} role="status" aria-label={t.common.loading}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-line bg-white">
          <Skeleton className="aspect-[16/9] rounded-none" />
          <div className="space-y-3 p-5"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></div>
        </div>
      ))}
    </div>
  );
}

/** Failure is a direction, not an apology: say what happened and offer the retry. */
export function ErrorBlock({ onRetry, dark }: { onRetry?: () => void; dark?: boolean }) {
  const { t } = useI18n();
  return (
    <div role="alert" className={cn('flex flex-col items-start gap-3 rounded-lg border p-5 sm:flex-row sm:items-center',
      dark ? 'border-white/15 text-white' : 'border-line bg-white')}>
      <Icon name="alert" className="h-6 w-6 shrink-0 text-trace" />
      <div className="flex-1">
        <p className="font-medium">{t.common.errorTitle}</p>
        <p className={cn('text-[15px]', dark ? 'text-white/70' : 'text-ink-muted')}>{t.common.errorBody}</p>
      </div>
      {onRetry && <button type="button" onClick={onRetry} className={cn('btn', dark ? 'btn-ghost-dark' : 'btn-outline')}>{t.common.retry}</button>}
    </div>
  );
}

export function EmptyBlock({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-white/60 px-5 py-10 text-center text-ink-muted">
      <p className="mx-auto max-w-prose">{children}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
