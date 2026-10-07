import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { mediaUrl } from '@/lib/api';
import { useData } from '@/hooks/useData';
import { useSeo } from '@/hooks/useSeo';
import { getAlbum, listAlbumImages } from '@/services/gallery';
import type { GalleryImage } from '@/types/content';
import { excerpt } from '@/utils/text';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyBlock, ErrorBlock, Skeleton } from '@/components/ui/Feedback';
import { GalleryGrid } from '@/components/GalleryGrid';

export default function AlbumPage() {
  const { slug = '' } = useParams();
  const { t, pickL, num } = useI18n();
  const album = useData(`album:${slug}`, () => getAlbum(slug));
  const a = album.data;
  const [page, setPage] = useState(1);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const pageQ = useData(a ? `album-images:${a.id}:${page}` : null, () => listAlbumImages(a!.id, page));
  const title = pickL(a, 'title');
  const desc = pickL(a, 'description');

  useEffect(() => { setPage(1); setImages([]); }, [slug]);
  useEffect(() => {
    if (!pageQ.data) return;
    setImages((prev) => {
      const seen = new Set(prev.map((p) => p.id));
      return page === 1 ? pageQ.data!.rows : [...prev, ...pageQ.data!.rows.filter((r) => !seen.has(r.id))];
    });
  }, [pageQ.data, page]);

  useSeo({
    title: a ? title.text : album.data === null ? t.gallery.notFound : undefined,
    description: a ? excerpt(desc.text || `${t.gallery.categories[a.category]} — ${t.gallery.photos(num(a.photo_count))}`, 160) : undefined,
    image: mediaUrl(a?.cover_thumb),
    noindex: album.data === null,
  }, album.data !== undefined);

  const crumbs = [{ to: '/gallery', label: t.nav.gallery }];
  if (album.error) return <div className="container-x py-16"><ErrorBlock onRetry={album.retry} /></div>;
  if (album.data === null) {
    return (
      <>
        <PageHeader title={t.gallery.notFound} crumbs={crumbs} />
        <div className="container-x py-12"><Link to="/gallery" className="btn btn-dark">{t.gallery.backToGallery}</Link></div>
      </>
    );
  }

  const total = pageQ.data?.total ?? a?.photo_count ?? 0;
  return (
    <>
      <PageHeader title={a ? title.text : ''} titleLang={title.lang} crumbs={crumbs}
        intro={a && <>
          <span className="flex gap-4 text-white/65"><span>{t.gallery.categories[a.category]}</span><span>{t.gallery.photos(num(a.photo_count))}</span></span>
          {desc.text && <span className="mt-2 block" lang={desc.lang}>{desc.text}</span>}
        </>} />
      <div className="container-x py-10 sm:py-14">
        {pageQ.error && images.length === 0 ? <ErrorBlock onRetry={pageQ.retry} />
          : !a || (images.length === 0 && !pageQ.data) ? (
            <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">{[0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className={`mb-3 ${i % 2 ? 'h-40' : 'h-56'}`} />)}</div>
          ) : images.length === 0 ? <EmptyBlock>{t.gallery.albumEmpty}</EmptyBlock>
          : (
            <>
              <GalleryGrid images={images} total={total} />
              {images.length < total && (
                <div className="mt-8 text-center">
                  <button type="button" className="btn btn-outline" disabled={pageQ.loading} onClick={() => setPage((p) => p + 1)}>
                    {pageQ.loading ? t.common.loading : t.common.loadMore}
                  </button>
                  {!!pageQ.error && <div className="mx-auto mt-4 max-w-md"><ErrorBlock onRetry={pageQ.retry} /></div>}
                </div>
              )}
              <div className="mt-10"><Link to="/gallery" className="link">{t.gallery.backToGallery}</Link></div>
            </>
          )}
      </div>
    </>
  );
}
