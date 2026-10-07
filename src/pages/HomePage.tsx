import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { mediaUrl } from '@/lib/api';
import { useData } from '@/hooks/useData';
import { useSeo } from '@/hooks/useSeo';
import { useSettings } from '@/hooks/useSettings';
import { listCourses } from '@/services/courses';
import { listFaqs, listInstructors, listStories } from '@/services/content';
import { listUpdates } from '@/services/updates';
import { listAlbums, listPracticePhotos } from '@/services/gallery';
import { telHref, whatsappHref } from '@/utils/contact';
import { Section } from '@/components/ui/Section';
import { CardsSkeleton, EmptyBlock, ErrorBlock } from '@/components/ui/Feedback';
import { Icon } from '@/components/ui/Icon';
import { HomeHero } from '@/components/home/HomeHero';
import { FactsStrip } from '@/components/home/FactsStrip';
import { CourseCard } from '@/components/CourseCard';
import { InstructorCard } from '@/components/InstructorCard';
import { UpdateCard } from '@/components/UpdateCard';
import { AlbumCard } from '@/components/AlbumCard';
import { SuccessStoryCard } from '@/components/SuccessStoryCard';
import { FAQAccordion } from '@/components/FAQAccordion';

export default function HomePage() {
  const { t, pickL } = useI18n();
  const s = useSettings();
  useSeo({});

  const courses = useData('courses', () => listCourses());
  const photos = useData('home:photos', () => listPracticePhotos(6));
  const instructors = useData('home:instructors', () => listInstructors(3));
  const updates = useData('home:updates', () => listUpdates({ limit: 3 }));
  const albums = useData('home:albums', () => listAlbums(4));
  const stories = useData('home:stories', () => listStories(3));
  const faqs = useData('home:faqs', () => listFaqs(5));

  return (
    <>
      <HomeHero courses={courses.data} />
      <FactsStrip courses={courses.data} />

      <Section id="why" title={t.why.title} intro={t.why.intro}>
        <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {t.why.items.map((w) => (
            <li key={w.title} className="border-l-2 border-trace/50 pl-5">
              <h3 className="text-[1.2rem] font-semibold">{w.title}</h3>
              <p className="mt-1.5 text-ink-soft">{w.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="courses" tone="white" title={t.courses.homeTitle} intro={t.courses.intro} action={{ to: '/courses', label: t.courses.all }}>
        {courses.error ? <ErrorBlock onRetry={courses.retry} />
          : !courses.data ? <CardsSkeleton className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" />
          : courses.data.length === 0 ? <EmptyBlock>{t.courses.empty}</EmptyBlock>
          : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.data.slice(0, 6).map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          )}
      </Section>

      <Section id="practice" title={t.practice.title} intro={t.practice.body} action={{ to: '/gallery', label: t.practice.link }}>
        {photos.data && photos.data.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {photos.data.map((p) => {
              const cap = pickL(p, 'caption');
              return (
                <li key={p.id}>
                  <Link to={`/gallery/${p.album.slug}`} className="group block overflow-hidden rounded-md bg-board/10">
                    <img src={mediaUrl(p.thumb_path) ?? ''} alt={cap.text || pickL(p.album, 'title').text} loading="lazy" decoding="async"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : photos.data ? <EmptyBlock>{t.practice.empty}</EmptyBlock> : null}
      </Section>

      {(instructors.data?.length ?? 0) > 0 && (
        <Section id="instructors" tone="white" title={t.instructors.homeTitle} intro={t.instructors.intro} action={{ to: '/instructors', label: t.instructors.all }}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {instructors.data!.map((i) => <InstructorCard key={i.id} instructor={i} />)}
          </div>
        </Section>
      )}

      {(updates.data?.rows.length ?? 0) > 0 && (
        <Section id="updates" title={t.updates.homeTitle} action={{ to: '/updates', label: t.updates.all }}>
          <div className="grid gap-6 md:grid-cols-3">
            {updates.data!.rows.map((u) => <UpdateCard key={u.id} update={u} />)}
          </div>
        </Section>
      )}

      {(albums.data?.length ?? 0) > 0 && (
        <Section id="gallery" tone="white" title={t.gallery.homeTitle} action={{ to: '/gallery', label: t.gallery.all }}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {albums.data!.map((a) => <AlbumCard key={a.id} album={a} />)}
          </div>
        </Section>
      )}

      {(stories.data?.length ?? 0) > 0 && (
        <Section id="stories" title={t.stories.homeTitle} intro={t.stories.intro} action={{ to: '/success-stories', label: t.stories.all }}>
          <div className="grid gap-6 md:grid-cols-3">
            {stories.data!.map((st) => <SuccessStoryCard key={st.id} story={st} />)}
          </div>
        </Section>
      )}

      {(faqs.data?.length ?? 0) > 0 && (
        <Section id="faq" tone="white" title={t.faq.homeTitle} intro={t.faq.intro} action={{ to: '/faq', label: t.faq.all }}>
          <div className="max-w-3xl"><FAQAccordion faqs={faqs.data!} /></div>
        </Section>
      )}

      <Section id="contact" tone="dark" title={t.cta.title} intro={t.cta.body}>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {s?.phone && <a href={telHref(s.phone)} className="btn btn-primary text-[17px]"><Icon name="phone" />{t.common.call} <span className="tabular-nums">{s.phone}</span></a>}
          {s?.whatsapp && <a href={whatsappHref(s.whatsapp)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp text-[17px]"><Icon name="whatsapp" />{t.common.whatsapp}</a>}
          <Link to="/contact" className="btn btn-ghost-dark text-[17px]"><Icon name="mail" />{t.common.sendMessage}</Link>
        </div>
        {pickL(s, 'address').text && (
          <p className="mt-6 flex items-start gap-2 text-white/75" lang={pickL(s, 'address').lang}>
            <Icon name="pin" className="mt-1 h-5 w-5 shrink-0 text-trace-bright" />
            <span className="whitespace-pre-line">{pickL(s, 'address').text}</span>
          </p>
        )}
      </Section>
    </>
  );
}
