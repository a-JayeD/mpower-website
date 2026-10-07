import { Link } from 'react-router-dom';
import { mediaUrl } from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import type { SuccessStory } from '@/types/content';
import { cn } from '@/utils/cn';
import { Img } from './ui/Img';

export function SuccessStoryCard({ story, full }: { story: SuccessStory; full?: boolean }) {
  const { t, pickL } = useI18n();
  const text = pickL(story, 'story');
  const course = story.course ? pickL(story.course, 'course_name') : null;
  const photo = mediaUrl(story.photo_path);
  return (
    <figure className="flex h-full flex-col rounded-lg border border-line bg-white p-6">
      {text.text && (
        <blockquote className={cn('flex-1 text-[16.5px] text-ink-soft', !full && 'line-clamp-6', 'whitespace-pre-line')} lang={text.lang}>
          {text.text}
        </blockquote>
      )}
      <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        {photo ? <Img src={photo} alt="" wrapperClassName="h-12 w-12 shrink-0 rounded-full" />
          : <span aria-hidden className="h-12 w-12 shrink-0 rounded-full bg-board-2 ring-2 ring-trace/40" />}
        <span className="min-w-0">
          <span className="block font-semibold text-ink">{story.student_name}</span>
          {course && story.course && (
            <span className="block text-[14px] text-ink-muted">
              {t.stories.course}: <Link to={`/courses/${story.course.slug}`} className="text-trace-dark hover:underline" lang={course.lang}>{course.text}</Link>
            </span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}
