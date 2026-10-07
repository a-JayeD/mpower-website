import { Link, useParams } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { config } from '@/lib/config';
import { mediaUrl } from '@/lib/api';
import { useData } from '@/hooks/useData';
import { useSeo } from '@/hooks/useSeo';
import { getUpdate, listUpdates } from '@/services/updates';
import { excerpt, RichText } from '@/utils/text';
import { PageHeader } from '@/components/ui/PageHeader';
import { ErrorBlock, Skeleton } from '@/components/ui/Feedback';
import { Img } from '@/components/ui/Img';
import { UpdateCard } from '@/components/UpdateCard';
import { ShareButtons } from '@/components/ShareButtons';

export default function UpdateDetailPage() {
  const { slug = '' } = useParams();
  const { t, pickL, date } = useI18n();
  const q = useData(`update:${slug}`, () => getUpdate(slug));
  const u = q.data;
  const more = useData(u ? `updates:more:${u.id}` : 'updates:more:none', () => listUpdates({ limit: 3, excludeId: u?.id }));
  const title = pickL(u, 'title');
  const body = pickL(u, 'content');

  useSeo({
    title: u ? title.text : q.data === null ? t.updates.notFound : undefined,
    description: u && body.text ? excerpt(body.text, 160) : undefined,
    image: mediaUrl(u?.cover_image_path),
    type: 'article',
    noindex: q.data === null,
  }, q.data !== undefined);

  const crumbs = [{ to: '/updates', label: t.nav.updates }];
  if (q.error) return <div className="container-x py-16"><ErrorBlock onRetry={q.retry} /></div>;
  if (q.data === undefined) {
    return <div className="container-x max-w-3xl space-y-4 py-16" aria-busy="true"><Skeleton className="h-10 w-3/4" /><Skeleton className="aspect-video" /><Skeleton className="h-40" /></div>;
  }
  if (!u) {
    return (
      <>
        <PageHeader title={t.updates.notFound} intro={t.updates.notFoundBody} crumbs={crumbs} />
        <div className="container-x grid gap-6 py-12 md:grid-cols-3">
          {(more.data?.rows ?? []).map((x) => <UpdateCard key={x.id} update={x} headingLevel={2} />)}
        </div>
      </>
    );
  }

  const cover = mediaUrl(u.cover_image_path);
  return (
    <>
      <PageHeader title={title.text} titleLang={title.lang} crumbs={crumbs}
        intro={<span className="flex flex-wrap gap-x-4 text-white/70"><span className="text-trace-bright">{t.updates.types[u.type]}</span><time dateTime={u.publish_date}>{t.updates.published} {date(u.publish_date)}</time></span>} />
      <article className="container-x py-12 sm:py-16">
        <div className="max-w-3xl">
          {cover && <Img src={cover} alt="" ratio="16/9" wrapperClassName="mb-8 rounded-lg" loading="eager" />}
          <RichText text={body.text} lang={body.lang} className="prose-body text-[17.5px]" />
          <div className="mt-10 border-t border-line pt-6">
            <ShareButtons title={title.text} url={`${config.siteUrl}/updates/${u.slug}`} />
          </div>
        </div>
      </article>
      {(more.data?.rows.length ?? 0) > 0 && (
        <section aria-labelledby="more-updates" className="border-t border-line bg-white">
          <div className="container-x py-14">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <h2 id="more-updates" className="text-[1.6rem] font-semibold">{t.updates.more}</h2>
              <Link to="/updates" className="link">{t.updates.all}</Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">{more.data!.rows.map((x) => <UpdateCard key={x.id} update={x} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
