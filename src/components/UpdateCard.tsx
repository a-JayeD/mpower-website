import { Link } from 'react-router-dom';
import { mediaUrl } from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import type { NewsUpdate } from '@/types/content';
import { excerpt } from '@/utils/text';
import { Img } from './ui/Img';
import { BoardPlaceholder } from './decor/BoardPlaceholder';

export function UpdateCard({ update, headingLevel = 3 }: { update: NewsUpdate; headingLevel?: 2 | 3 }) {
  const { t, pickL, date } = useI18n();
  const title = pickL(update, 'title');
  const body = pickL(update, 'content');
  const cover = mediaUrl(update.cover_image_path);
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article className="group relative focus-within:ring-2 focus-within:ring-trace focus-within:ring-offset-2 flex flex-col overflow-hidden rounded-lg border border-line bg-white transition-colors hover:border-trace/60">
      {cover ? <Img src={cover} alt="" ratio="16/9" /> : <BoardPlaceholder />}
      <div className="flex flex-1 flex-col p-5">
        <p className="flex flex-wrap items-center gap-x-3 text-[14px] text-ink-muted">
          <span className="font-medium text-trace-dark">{t.updates.types[update.type]}</span>
          <time dateTime={update.publish_date}>{date(update.publish_date)}</time>
        </p>
        <H className="mt-2 text-[1.2rem] font-semibold leading-snug" lang={title.lang}>
          <Link to={`/updates/${update.slug}`} className="card-link focus-visible:outline-none group-hover:text-trace-dark">{title.text}</Link>
        </H>
        {body.text && <p className="mt-2 line-clamp-3 text-[15.5px] text-ink-soft" lang={body.lang}>{excerpt(body.text, 160)}</p>}
      </div>
    </article>
  );
}
