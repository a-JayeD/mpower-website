import { Link, useParams } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { mediaUrl } from '@/lib/api';
import { useData } from '@/hooks/useData';
import { useSeo } from '@/hooks/useSeo';
import { useSettings } from '@/hooks/useSettings';
import { getCourse, listCourses } from '@/services/courses';
import { excerpt, RichText } from '@/utils/text';
import { telHref, whatsappHref } from '@/utils/contact';
import { PageHeader } from '@/components/ui/PageHeader';
import { ErrorBlock, Skeleton } from '@/components/ui/Feedback';
import { Icon } from '@/components/ui/Icon';
import { Img } from '@/components/ui/Img';
import { CourseCard } from '@/components/CourseCard';

export default function CourseDetailPage() {
  const { slug = '' } = useParams();
  const { t, pickL, num, money, other } = useI18n();
  const s = useSettings();
  const q = useData(`course:${slug}`, () => getCourse(slug));
  const all = useData('courses', () => listCourses());
  const c = q.data;
  const name = pickL(c, 'course_name');
  const desc = pickL(c, 'description');
  const duration = pickL(c, 'duration');

  useSeo({
    title: c ? name.text : q.data === null ? t.courses.notFound : undefined,
    description: c && desc.text ? excerpt(desc.text, 160) : undefined,
    image: mediaUrl(c?.image_path),
    noindex: q.data === null,
  }, q.data !== undefined);

  if (q.error) return <div className="container-x py-16"><ErrorBlock onRetry={q.retry} /></div>;
  if (q.data === undefined) {
    return (
      <div aria-busy="true">
        <div className="bg-board py-16"><div className="container-x"><Skeleton className="h-10 w-2/3 bg-white/10" /></div></div>
        <div className="container-x grid gap-8 py-12 lg:grid-cols-[1fr_22rem]"><Skeleton className="aspect-video" /><Skeleton className="h-72" /></div>
      </div>
    );
  }

  const others = (all.data ?? []).filter((x) => x.id !== c?.id).slice(0, 3);

  if (!c) {
    return (
      <>
        <PageHeader title={t.courses.notFound} intro={t.courses.notFoundBody} crumbs={[{ to: '/courses', label: t.nav.courses }]} />
        <div className="container-x grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {(all.data ?? []).slice(0, 6).map((x) => <CourseCard key={x.id} course={x} headingLevel={2} />)}
        </div>
      </>
    );
  }

  const otherName = (c as unknown as Record<string, string>)[`course_name_${other}`];
  const img = mediaUrl(c.image_path);
  const waText = t.courses.whatsappText(c.course_name_en + (c.course_name_bn ? ` / ${c.course_name_bn}` : ''));

  const specs: Array<{ label: string; value: string; lang?: string }> = [
    { label: t.courses.classes, value: t.courses.classesValue(num(c.total_classes)) },
    { label: t.courses.duration, value: duration.text || t.courses.notSet, lang: duration.text ? duration.lang : undefined },
    { label: t.courses.fee, value: c.joining_fee > 0 ? money(c.joining_fee) : t.courses.notSet },
  ];
  // Week starts on Saturday in Bangladesh.
  if (c.class_days.length) specs.push({ label: t.courses.classDays, value: c.class_days.slice().sort((a, b) => ((a + 1) % 7) - ((b + 1) % 7)).map((d) => t.weekdays[d]).join(', ') });
  specs.push({ label: t.courses.status, value: c.status === 'upcoming' ? t.courses.upcoming : t.courses.active });

  return (
    <>
      <PageHeader title={name.text} titleLang={name.lang} crumbs={[{ to: '/courses', label: t.nav.courses }]}
        intro={otherName && otherName !== name.text ? <span lang={other}>{otherName}</span> : undefined} />
      <div className="container-x grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_23rem]">
        <div className="min-w-0">
          {img && <Img src={img} alt={name.text} ratio="16/9" wrapperClassName="mb-8 rounded-lg" loading="eager" />}
          <h2 className="text-[1.5rem] font-semibold">{t.courses.aboutCourse}</h2>
          {desc.text ? <RichText text={desc.text} lang={desc.lang} className="prose-body mt-4 max-w-prose text-[17.5px]" />
            : <p className="mt-4 text-ink-muted">{t.courses.askBody}</p>}
          <p className="mt-8 flex max-w-prose gap-3 rounded-md bg-trace-soft p-4 text-[15.5px] text-ink-soft">
            <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-trace-dark" />{t.courses.completionNote}
          </p>
        </div>

        <aside className="space-y-6 self-start lg:sticky lg:top-24">
          <section aria-labelledby="glance" className="rounded-lg border border-line bg-white">
            <h2 id="glance" className="border-b border-line px-5 py-3 text-[1.1rem] font-semibold">{t.courses.atAGlance}</h2>
            <dl className="divide-y divide-line">
              {specs.map((sp) => (
                <div key={sp.label} className="flex items-baseline justify-between gap-4 px-5 py-3">
                  <dt className="text-ink-muted">{sp.label}</dt>
                  <dd className="text-right font-display text-[1.1rem] font-semibold tabular-nums" lang={sp.lang}>{sp.value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section aria-labelledby="ask" className="on-dark rounded-lg bg-board p-5 text-white">
            <h2 id="ask" className="text-[1.2rem] font-semibold text-white">{t.courses.askTitle}</h2>
            <p className="mt-2 text-[15.5px] text-white/75">{t.courses.askBody}</p>
            <div className="mt-4 grid gap-2">
              {s?.phone && <a href={telHref(s.phone)} className="btn btn-primary"><Icon name="phone" />{t.common.call}</a>}
              {s?.whatsapp && <a href={whatsappHref(s.whatsapp, waText)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp"><Icon name="whatsapp" />{t.common.whatsapp}</a>}
              <Link to={`/contact?course=${encodeURIComponent(c.slug)}`} className="btn btn-ghost-dark"><Icon name="mail" />{t.common.sendMessage}</Link>
            </div>
          </section>
        </aside>
      </div>

      {others.length > 0 && (
        <section aria-labelledby="other-courses" className="border-t border-line bg-white">
          <div className="container-x py-14">
            <h2 id="other-courses" className="mb-6 text-[1.6rem] font-semibold">{t.courses.other}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{others.map((x) => <CourseCard key={x.id} course={x} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
