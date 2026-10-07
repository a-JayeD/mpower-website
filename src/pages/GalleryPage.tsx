import { useMemo, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useData } from '@/hooks/useData';
import { useSeo } from '@/hooks/useSeo';
import { listAlbums } from '@/services/gallery';
import type { AlbumCategory } from '@/types/content';
import { cn } from '@/utils/cn';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyBlock, ErrorBlock, Skeleton } from '@/components/ui/Feedback';
import { AlbumCard } from '@/components/AlbumCard';

export default function GalleryPage() {
  const { t } = useI18n();
  useSeo({});
  const q = useData('albums', () => listAlbums());
  const [cat, setCat] = useState<AlbumCategory | 'all'>('all');
  const cats = useMemo(() => Array.from(new Set((q.data ?? []).map((a) => a.category))), [q.data]);
  const shown = (q.data ?? []).filter((a) => cat === 'all' || a.category === cat);

  return (
    <>
      <PageHeader title={t.gallery.title} intro={t.gallery.intro} />
      <div className="container-x py-12 sm:py-16">
        {cats.length > 1 && (
          <div role="group" aria-label={t.gallery.title} className="mb-8 flex flex-wrap gap-2">
            {(['all', ...cats] as const).map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}
                className={cn('min-h-[44px] rounded-full border px-4 text-[15px] transition-colors',
                  cat === c ? 'border-board bg-board text-white' : 'border-line bg-white text-ink-soft hover:border-trace hover:text-trace-dark')}>
                {c === 'all' ? t.gallery.filterAll : t.gallery.categories[c]}
              </button>
            ))}
          </div>
        )}
        {q.error ? <ErrorBlock onRetry={q.retry} />
          : !q.data ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="aspect-[4/3]" />)}</div>
          : shown.length === 0 ? <EmptyBlock>{t.gallery.empty}</EmptyBlock>
          : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{shown.map((a) => <AlbumCard key={a.id} album={a} headingLevel={2} />)}</div>}
      </div>
    </>
  );
}
