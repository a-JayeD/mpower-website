import { Link } from 'react-router-dom';
import { mediaUrl } from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import type { Course } from '@/types/content';
import { excerpt } from '@/utils/text';
import { cn } from '@/utils/cn';
import { Img } from './ui/Img';
import { BoardPlaceholder } from './decor/BoardPlaceholder';

/** Course as a component datasheet: name, what it is, then the three numbers people ask about. */
export function CourseCard({ course, headingLevel = 3 }: { course: Course; headingLevel?: 2 | 3 }) {
  const { t, pickL, num, money, other } = useI18n();
  const name = pickL(course, 'course_name');
  const otherName = (course as unknown as Record<string, string>)[`course_name_${other}`];
  const desc = pickL(course, 'description');
  const duration = pickL(course, 'duration');
  const img = mediaUrl(course.image_path);
  const H = headingLevel === 2 ? 'h2' : 'h3';

  return (
    <article className="group relative focus-within:ring-2 focus-within:ring-trace focus-within:ring-offset-2 flex flex-col overflow-hidden rounded-lg border border-line bg-white shadow-card transition-[border-color,box-shadow] hover:border-trace/60 hover:shadow-lift">
      <div className="relative">
        {img ? <Img src={img} alt="" ratio="16/9" /> : <BoardPlaceholder label={name.text} />}
        <span className={cn('absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-medium',
          course.status === 'upcoming' ? 'bg-white text-ink' : 'bg-board/85 text-white')}>
          <span aria-hidden className={cn('h-2 w-2 rounded-full', course.status === 'upcoming' ? 'bg-trace' : 'bg-led')} />
          {course.status === 'upcoming' ? t.courses.upcoming : t.courses.active}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <H className="text-[1.3rem] font-semibold leading-snug" lang={name.lang}>
          <Link to={`/courses/${course.slug}`} className="card-link focus-visible:outline-none">{name.text}</Link>
        </H>
        {otherName && otherName !== name.text && <p className="text-[15px] text-ink-muted" lang={other}>{otherName}</p>}
        {desc.text && <p className="mt-3 line-clamp-3 text-[15.5px] text-ink-soft" lang={desc.lang}>{excerpt(desc.text, 170)}</p>}
        <div className="mt-auto pt-5">
        <dl className="grid grid-cols-3 border-t border-line pt-4 text-[14px] [&>div+div]:border-l [&>div+div]:border-line [&>div+div]:pl-3 [&>div]:pr-2">
          <div>
            <dt className="text-ink-muted">{t.courses.classes}</dt>
            <dd className="font-display text-[1.15rem] font-semibold text-ink tabular-nums">{num(course.total_classes)}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">{t.courses.duration}</dt>
            <dd className="font-display text-[1.05rem] font-semibold leading-tight text-ink" lang={duration.text ? duration.lang : undefined}>{duration.text || '—'}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">{t.courses.fee}</dt>
            <dd className="font-display text-[1.15rem] font-semibold text-ink tabular-nums">{course.joining_fee > 0 ? money(course.joining_fee) : <span className="text-[15px] font-medium text-ink-muted">{t.courses.notSet}</span>}</dd>
          </div>
        </dl>
        </div>
      </div>
    </article>
  );
}
