import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useData } from '@/hooks/useData';
import { useSeo } from '@/hooks/useSeo';
import { listUpdates } from '@/services/updates';
import type { NewsUpdate, UpdateType } from '@/types/content';
import { cn } from '@/utils/cn';
import { PageHeader } from '@/components/ui/PageHeader';
import { CardsSkeleton, EmptyBlock, ErrorBlock } from '@/components/ui/Feedback';
import { UpdateCard } from '@/components/UpdateCard';

const TYPES: UpdateType[] = ['announcement', 'news', 'notice', 'event'];

export default function UpdatesPage() {
  const { t } = useI18n();
  useSeo({});
  const [type, setType] = useState<UpdateType | undefined>();
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<NewsUpdate[]>([]);
  const q = useData(`updates:${type ?? 'all'}:${page}`, () => listUpdates({ type, page }));

  useEffect(() => {
    if (!q.data) return;
    setRows((prev) => (page === 1 ? q.data!.rows : [...prev, ...q.data!.rows.filter((r) => !prev.some((p) => p.id === r.id))]));
  }, [q.data, page]);

  const total = q.data?.total ?? 0;
  return (
    <>
      <PageHeader title={t.updates.title} intro={t.updates.intro} />
      <div className="container-x py-12 sm:py-16">
        <div role="group" aria-label={t.updates.title} className="mb-8 flex flex-wrap gap-2">
          {[undefined, ...TYPES].map((ty) => (
            <button key={ty ?? 'all'} type="button" aria-pressed={type === ty} onClick={() => { setType(ty); setPage(1); setRows([]); }}
              className={cn('min-h-[44px] rounded-full border px-4 text-[15px] transition-colors',
                type === ty ? 'border-board bg-board text-white' : 'border-line bg-white text-ink-soft hover:border-trace hover:text-trace-dark')}>
              {ty ? t.updates.types[ty] : t.updates.filterAll}
            </button>
          ))}
        </div>
        {q.error && rows.length === 0 ? <ErrorBlock onRetry={q.retry} />
          : !q.data && rows.length === 0 ? <CardsSkeleton count={3} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" />
          : rows.length === 0 ? <EmptyBlock>{type ? t.updates.emptyType : t.updates.empty}</EmptyBlock>
          : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{rows.map((u) => <UpdateCard key={u.id} update={u} headingLevel={2} />)}</div>
              {rows.length < total && (
                <div className="mt-10 text-center">
                  <button type="button" className="btn btn-outline" disabled={q.loading} onClick={() => setPage((p) => p + 1)}>
                    {q.loading ? t.common.loading : t.common.loadMore}
                  </button>
                </div>
              )}
            </>
          )}
      </div>
    </>
  );
}
