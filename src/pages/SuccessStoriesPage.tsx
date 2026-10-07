import { useI18n } from '@/lib/i18n';
import { useData } from '@/hooks/useData';
import { useSeo } from '@/hooks/useSeo';
import { listStories } from '@/services/content';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyBlock, ErrorBlock, Skeleton } from '@/components/ui/Feedback';
import { SuccessStoryCard } from '@/components/SuccessStoryCard';

export default function SuccessStoriesPage() {
  const { t } = useI18n();
  useSeo({});
  const q = useData('stories', () => listStories());
  return (
    <>
      <PageHeader title={t.stories.title} intro={t.stories.intro} />
      <div className="container-x py-12 sm:py-16">
        {q.error ? <ErrorBlock onRetry={q.retry} />
          : !q.data ? <div className="grid gap-6 md:grid-cols-2">{[0, 1].map((i) => <Skeleton key={i} className="h-56" />)}</div>
          : q.data.length === 0 ? <EmptyBlock>{t.stories.empty}</EmptyBlock>
          : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{q.data.map((s) => <SuccessStoryCard key={s.id} story={s} full />)}</div>}
      </div>
    </>
  );
}
