import { mediaUrl } from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import type { Instructor } from '@/types/content';
import { cn } from '@/utils/cn';
import { Img } from './ui/Img';

export function InstructorCard({ instructor, full }: { instructor: Instructor; full?: boolean }) {
  const { t, pickL } = useI18n();
  const name = pickL(instructor, 'name');
  const position = pickL(instructor, 'position');
  const bio = pickL(instructor, 'bio');
  const photo = mediaUrl(instructor.photo_path);
  const initials = (instructor.name_en || name.text).split(/\s+/).filter((w) => /^[A-Za-z]/.test(w) && !/\.$/.test(w)).slice(0, 2).map((w) => w[0]).join('');
  return (
    <article className="flex flex-col rounded-lg border border-line bg-white p-5">
      <div className="flex items-center gap-4">
        {photo ? <Img src={photo} alt={name.text} wrapperClassName="h-20 w-20 shrink-0 rounded-full ring-2 ring-line" />
          : <div aria-hidden className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-board font-display text-xl font-semibold text-trace-bright">{initials || '•'}</div>}
        <div className="min-w-0">
          <h3 className="text-[1.15rem] font-semibold leading-snug" lang={name.lang}>{name.text}</h3>
          {position.text && <p className="text-[15px] text-ink-muted" lang={position.lang}>{position.text}</p>}
        </div>
      </div>
      {instructor.specialization && (
        <p className="mt-4 text-[15px]"><span className="text-ink-muted">{t.instructors.specialization}: </span><span className="font-medium text-ink" lang="en">{instructor.specialization}</span></p>
      )}
      {bio.text && <p className={cn('mt-3 text-[15.5px] text-ink-soft', !full && 'line-clamp-4', full && 'whitespace-pre-line')} lang={bio.lang}>{bio.text}</p>}
    </article>
  );
}
