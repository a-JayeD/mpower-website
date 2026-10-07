import { useSearchParams } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useData } from '@/hooks/useData';
import { useSeo } from '@/hooks/useSeo';
import { listCourses } from '@/services/courses';
import { PageHeader } from '@/components/ui/PageHeader';
import { ContactDetails } from '@/components/ContactDetails';
import { MapEmbed } from '@/components/MapEmbed';
import { ContactForm } from '@/components/ContactForm';

export default function ContactPage() {
  const { t, pick } = useI18n();
  useSeo({});
  const [params] = useSearchParams();
  const courseSlug = params.get('course');
  const courses = useData(courseSlug ? 'courses' : null, () => listCourses());
  const course = courses.data?.find((c) => c.slug === courseSlug);
  // Wait for the course name before mounting the form so the subject is pre-filled.
  const ready = !courseSlug || courses.data !== undefined || !!courses.error;

  return (
    <>
      <PageHeader title={t.contact.title} intro={t.contact.intro} />
      <div className="container-x grid gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_1.15fr]">
        <div className="space-y-6">
          <ContactDetails />
          <MapEmbed />
        </div>
        <section aria-labelledby="form-title" className="self-start rounded-lg border border-line bg-white p-5 sm:p-8">
          <h2 id="form-title" className="mb-2 text-[1.5rem] font-semibold">{t.contact.formTitle}</h2>
          {ready && <ContactForm initialSubject={course ? pick(course, 'course_name') : ''} />}
        </section>
      </div>
    </>
  );
}
