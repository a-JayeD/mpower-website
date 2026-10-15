import { Link } from 'react-router-dom';
import { mediaUrl } from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/hooks/useSettings';
import { cn } from '@/utils/cn';

/** Default mark: an IC package whose traces form an "M". Replaced by the uploaded logo when there is one. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" rx="7" fill="#10264A" stroke="#25467A" />
      <path d="M10 29V12l10 11 10-11v17" fill="none" stroke="#5BD3F2" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="10" cy="29" r="2.6" fill="#10264A" stroke="#5BD3F2" strokeWidth="2" />
      <circle cx="30" cy="29" r="2.6" fill="#22A867" />
    </svg>
  );
}

export function Brand({ compact, onDark = true }: { compact?: boolean; onDark?: boolean }) {
  const { lang } = useI18n();
  const s = useSettings();
  const logo = mediaUrl(s?.logo_path);
  const nameEn = s?.center_name_en || 'M.Power Engineering';
  const nameBn = s?.center_name_bn || 'এম.পাওয়ার ইঞ্জিনিয়ারিং';
  const primary = lang === 'bn' ? nameBn : nameEn;
  const secondary = lang === 'bn' ? nameEn : nameBn;
  return (
    <Link to="/" className="flex min-h-[48px] items-center gap-3" aria-label={`${primary} — ${lang === 'bn' ? 'হোম' : 'Home'}`}>
      {logo ? <img src={logo} alt="" className="h-10 w-10 rounded-md bg-white object-contain p-0.5" width={40} height={40} />
        : <BrandMark className="h-10 w-10 shrink-0" />}
      <span className="leading-tight">
        <span className={cn('block whitespace-nowrap font-display text-[16px] font-semibold sm:text-[17px]', onDark ? 'text-white' : 'text-ink')}>{primary}</span>
        {!compact && <span className={cn('hidden text-[13px] sm:block', onDark ? 'text-white/60' : 'text-ink-muted')} lang={lang === 'bn' ? 'en' : 'bn'}>{secondary}</span>}
      </span>
    </Link>
  );
}
