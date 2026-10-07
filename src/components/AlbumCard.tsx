import { Link } from 'react-router-dom';
import { mediaUrl } from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import type { Album } from '@/types/content';
import { Img } from './ui/Img';
import { BoardPlaceholder } from './decor/BoardPlaceholder';

export function AlbumCard({ album, headingLevel = 3 }: { album: Album; headingLevel?: 2 | 3 }) {
  const { t, pickL, num } = useI18n();
  const title = pickL(album, 'title');
  const cover = mediaUrl(album.cover_thumb);
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article className="group relative focus-within:ring-2 focus-within:ring-trace focus-within:ring-offset-2 overflow-hidden rounded-lg bg-board">
      {cover ? <Img src={cover} alt="" ratio="4/3" className="transition-transform duration-500 group-hover:scale-[1.03]" /> : <BoardPlaceholder ratio="4/3" />}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-board via-board/80 to-transparent p-4 pt-12 text-white">
        <p className="flex gap-3 text-[13px] text-white/75"><span>{t.gallery.categories[album.category]}</span><span>{t.gallery.photos(num(album.photo_count))}</span></p>
        <H className="mt-0.5 text-[1.1rem] font-semibold leading-snug text-white" lang={title.lang}>
          <Link to={`/gallery/${album.slug}`} className="card-link focus-visible:outline-none">{title.text}</Link>
        </H>
      </div>
    </article>
  );
}
