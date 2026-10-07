import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/hooks/useSettings';
import type { Course } from '@/types/content';
import { HeroSchematic } from '@/components/decor/HeroSchematic';
import { Waveform } from '@/components/decor/Waveform';

export function HomeHero({ courses }: { courses: Course[] | undefined }) {
  const { t, tOther, lang, other, pickL } = useI18n();
  const s = useSettings();
  const r = (s ?? {}) as Record<string, string | undefined>;
  // Headline in the visitor's language, with the other language as a quieter second line.
  const title = r[`hero_title_${lang}`]?.trim() || t.hero.fallbackTitle;
  const altTitle = r[`hero_title_${other}`]?.trim() || tOther.hero.fallbackTitle;
  const subtitle = r[`hero_subtitle_${lang}`]?.trim() || t.hero.fallbackSubtitle;
  const name = pickL(s, 'center_name');
  const labels = (courses ?? []).map((c) => pickL(c, 'course_name'));

  return (
    <section aria-labelledby="hero-title" className="on-dark tech-grid relative overflow-hidden bg-board text-white">
      {/* soft cyan bloom behind the chip, the only gradient on the site */}
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full bg-trace/10 blur-3xl" />
      <div className="container-x relative grid items-center gap-10 pb-10 pt-12 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-6 lg:pb-14 lg:pt-20">
        <div>
          <p className="mb-5 hidden items-center sm:inline-flex gap-2 rounded-full border border-white/15 px-3 py-1 text-[14px] text-white/80" lang={name.text ? name.lang : undefined}>
            <span aria-hidden className="h-2 w-2 rounded-full bg-led" />
            {name.text || 'M.Power Engineering'}
          </p>
          <h1 id="hero-title" className="text-[2.15rem] font-semibold leading-[1.2] text-white sm:text-[2.9rem] lg:text-[3.3rem]">{title}</h1>
          <p className="mt-3 text-[1.1rem] text-trace-bright/90 sm:text-[1.25rem]" lang={other}>{altTitle}</p>
          <p className="mt-6 max-w-xl text-[17px] text-white/80 sm:text-[18px]">{subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/courses" className="btn btn-primary text-[17px]">{t.hero.ctaCourses}</Link>
            <Link to="/contact" className="btn btn-ghost-dark text-[17px]">{t.hero.ctaContact}</Link>
          </div>
        </div>
        <div className="mx-auto hidden w-full max-w-[34rem] sm:block">
          <HeroSchematic labels={labels} />
        </div>
      </div>
      <Waveform className="relative block h-12 w-full sm:h-14" />
    </section>
  );
}
