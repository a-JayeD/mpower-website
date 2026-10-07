import { useI18n } from '@/lib/i18n';
import { useData } from '@/hooks/useData';
import { useSeo } from '@/hooks/useSeo';
import { listCourses } from '@/services/courses';
import { PageHeader } from '@/components/ui/PageHeader';
import { CardsSkeleton, EmptyBlock, ErrorBlock } from '@/components/ui/Feedback';
import { CourseCard } from '@/components/CourseCard';

export default function CoursesPage() {
  const { t } = useI18n();
  useSeo({});
  const courses = useData('courses', () => listCourses());
  return (
    <>
      <PageHeader title={t.courses.title} intro={t.courses.intro} />
      <div className="container-x py-12 sm:py-16">
        {courses.error ? <ErrorBlock onRetry={courses.retry} />
          : !courses.data ? <CardsSkeleton count={6} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" />
          : courses.data.length === 0 ? <EmptyBlock>{t.courses.empty}</EmptyBlock>
          : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.data.map((c) => <CourseCard key={c.id} course={c} headingLevel={2} />)}
            </div>
          )}
      </div>
    </>
  );
}
