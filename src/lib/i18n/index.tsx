import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { bn } from './bn';
import { en, type Dict } from './en';
import type { Lang } from '@/lib/seo/head';

export type { Lang };
const DICTS: Record<Lang, Dict> = { bn, en };
const STORAGE_KEY = 'mpower-lang';

function initialLang(): Lang {
  try {
    const q = new URLSearchParams(window.location.search).get('lang');
    if (q === 'en' || q === 'bn') return q;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'bn') return saved;
  } catch { /* private mode */ }
  return 'bn'; // Bangla is the default
}

interface I18n {
  lang: Lang;
  other: Lang;
  t: Dict;
  /** Interface text in the other language (e.g. the hero's alternative headline). */
  tOther: Dict;
  setLang: (l: Lang) => void;
  /** Pick `field_bn` / `field_en` from a record, falling back to the other language when empty. */
  pick: <K extends string>(row: Partial<Record<`${K}_bn` | `${K}_en`, string | null>> | null | undefined, field: K) => string;
  /** Same as pick, but also returns which language the text is actually in (for the `lang` attribute). */
  pickL: <K extends string>(row: Partial<Record<`${K}_bn` | `${K}_en`, string | null>> | null | undefined, field: K) => { text: string; lang: Lang };
  num: (n: number) => string;
  money: (n: number) => string;
  date: (iso: string, opts?: Intl.DateTimeFormatOptions) => string;
}

const Ctx = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
    // Drop ?lang= so the stored preference is what applies from now on.
    const url = new URL(window.location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.delete('lang');
      window.history.replaceState(window.history.state, '', url);
    }
  }, []);

  const value = useMemo<I18n>(() => {
    const other: Lang = lang === 'bn' ? 'en' : 'bn';
    const locale = lang === 'bn' ? 'bn-BD' : 'en-GB';
    const nf = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    const pickL: I18n['pickL'] = (row, field) => {
      const r = (row ?? {}) as Record<string, string | null | undefined>;
      const mine = r[`${field}_${lang}`]?.trim();
      if (mine) return { text: mine, lang };
      return { text: r[`${field}_${other}`]?.trim() ?? '', lang: other };
    };
    return {
      lang, other, t: DICTS[lang], tOther: DICTS[other], setLang, pickL,
      pick: (row, field) => pickL(row, field).text,
      num: (n) => nf.format(n),
      money: (n) => `৳${nf.format(n)}`,
      date: (iso, opts) => {
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return '';
        return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Dhaka', ...opts }).format(d);
      },
    };
  }, [lang, setLang]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
