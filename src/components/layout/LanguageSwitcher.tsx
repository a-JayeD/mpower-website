import { useI18n, type Lang } from '@/lib/i18n';
import { cn } from '@/utils/cn';

const OPTIONS: Array<{ lang: Lang; label: string }> = [
  { lang: 'bn', label: 'বাংলা' },
  { lang: 'en', label: 'English' },
];

/** Always shows both language names in their own script, so anyone can find theirs. */
export function LanguageSwitcher({ onDark = true, size = 'md' }: { onDark?: boolean; size?: 'sm' | 'md' }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div role="group" aria-label={t.nav.language}
      className={cn('inline-flex rounded-md p-0.5', onDark ? 'bg-white/10 ring-1 ring-white/15' : 'bg-paper ring-1 ring-line')}>
      {OPTIONS.map((o) => {
        const active = o.lang === lang;
        return (
          <button key={o.lang} type="button" lang={o.lang} aria-pressed={active} onClick={() => setLang(o.lang)}
            className={cn('rounded font-medium transition-colors',
              size === 'sm' ? 'min-h-[36px] px-3 text-[14px]' : 'min-h-[44px] px-4 text-[15px]',
              active ? (onDark ? 'bg-trace text-board' : 'bg-board text-white')
                : (onDark ? 'text-white/80 hover:text-white' : 'text-ink-soft hover:text-ink'))}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
