import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { mediaUrl } from '@/lib/api';
import { useData } from '@/hooks/useData';
import { useSeo } from '@/hooks/useSeo';
import { useSettings } from '@/hooks/useSettings';
import { listPracticePhotos } from '@/services/gallery';
import { RichText } from '@/utils/text';
import { PageHeader } from '@/components/ui/PageHeader';

export default function AboutPage() {
  const { t, pickL } = useI18n();
  const s = useSettings();
  useSeo({});
  const photos = useData('about:photos', () => listPracticePhotos(6, ['facilities', 'training', 'workshop']));
  const about = pickL(s, 'about');

  const blocks = [
    { title: t.about.teachTitle, body: t.about.teachBody },
    { title: t.about.approachTitle, body: t.about.approachBody },
    { title: t.about.labTitle, body: t.about.labBody },
    { title: t.about.whoTitle, body: t.about.whoBody },
  ];

  return (
    <>
      <PageHeader title={t.about.title} intro={t.about.lead} />
      <div className="container-x py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-12">
            {about.text && (
              <section aria-labelledby="from-center">
                <h2 id="from-center" className="text-[1.6rem] font-semibold">{t.about.fromCenter}</h2>
                <RichText text={about.text} lang={about.lang} className="prose-body mt-4 max-w-prose text-[17.5px]" />
              </section>
            )}
            <div className="grid gap-10 sm:grid-cols-2">
              {blocks.map((b) => (
                <section key={b.title} className="border-t-2 border-trace/50 pt-4">
                  <h2 className="text-[1.3rem] font-semibold">{b.title}</h2>
                  <p className="mt-2 text-ink-soft">{b.body}</p>
                </section>
              ))}
            </div>
          </div>
          <aside className="space-y-3 self-start rounded-lg border border-line bg-white p-5 lg:sticky lg:top-24">
            <Link to="/courses" className="btn btn-dark w-full">{t.hero.ctaCourses}</Link>
            <Link to="/instructors" className="btn btn-outline w-full">{t.instructors.all}</Link>
            <Link to="/contact" className="btn btn-outline w-full">{t.nav.cta}</Link>
          </aside>
        </div>

        {photos.data && photos.data.length > 0 && (
          <section aria-labelledby="about-photos" className="mt-16">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <h2 id="about-photos" className="text-[1.6rem] font-semibold">{t.about.photos}</h2>
              <Link to="/gallery" className="link">{t.practice.link}</Link>
            </div>
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {photos.data.map((p) => {
                const cap = pickL(p, 'caption');
                return (
                  <li key={p.id}>
                    <figure>
                      <img src={mediaUrl(p.thumb_path) ?? ''} alt={cap.text || pickL(p.album, 'title').text} loading="lazy" decoding="async"
                        className="aspect-[4/3] w-full rounded-md object-cover" />
                      {cap.text && <figcaption className="mt-1.5 text-[14px] text-ink-muted" lang={cap.lang}>{cap.text}</figcaption>}
                    </figure>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
