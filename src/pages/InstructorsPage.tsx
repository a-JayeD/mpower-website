import { useI18n } from '@/lib/i18n';
import { useData } from '@/hooks/useData';
import { useSeo } from '@/hooks/useSeo';
import { listInstructors } from '@/services/content';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyBlock, ErrorBlock, Skeleton } from '@/components/ui/Feedback';
import { InstructorCard } from '@/components/InstructorCard';

export default function InstructorsPage() {
  const { t } = useI18n();
  useSeo({});
  const q = useData('instructors', () => listInstructors());
  return (
    <>
      <PageHeader title={t.instructors.title} intro={t.instructors.intro} />
      <div className="container-x py-12 sm:py-16">
        {q.error ? <ErrorBlock onRetry={q.retry} />
          : !q.data ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-56" />)}</div>
          : q.data.length === 0 ? <EmptyBlock>{t.instructors.empty}</EmptyBlock>
          : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{q.data.map((i) => <InstructorCard key={i.id} instructor={i} full />)}</div>}
      </div>
    </>
  );
}
