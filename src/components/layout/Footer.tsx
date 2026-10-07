import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/hooks/useSettings';
import { useData } from '@/hooks/useData';
import { listCourses } from '@/services/courses';
import { isSafeUrl, telHref, whatsappHref } from '@/utils/contact';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Brand } from './Brand';
import { LanguageSwitcher } from './LanguageSwitcher';
import { navItems } from './navItems';

export function Footer() {
  const { t, pick, pickL } = useI18n();
  const s = useSettings();
  const courses = useData('courses', () => listCourses());
  const footer = pickL(s, 'footer_text');
  const address = pickL(s, 'address');

  const social: Array<{ href: string; label: string; icon: IconName }> = [
    { href: s?.facebook_url ?? '', label: t.contact.facebook, icon: 'facebook' as const },
    { href: s?.messenger_url ?? '', label: t.contact.messenger, icon: 'messenger' as const },
    { href: s?.youtube_url ?? '', label: t.contact.youtube, icon: 'youtube' as const },
  ].filter((x) => isSafeUrl(x.href));

  return (
    <footer className="on-dark relative overflow-hidden bg-board text-white/80">
      {/* the page's signal path terminates here */}
      <svg aria-hidden className="absolute left-0 top-0 h-6 w-full text-board-line" preserveAspectRatio="none" viewBox="0 0 1200 24">
        <path d="M0 12h420l10-10h340l10 10h420" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="space-y-4">
          <Brand />
          <p className="max-w-sm text-[15px] text-white/70">{t.footer.description}</p>
          {social.length > 0 && (
            <div>
              <p className="mb-2 text-[14px] text-white/55">{t.footer.follow}</p>
              <ul className="flex gap-2">
                {social.map((x) => (
                  <li key={x.icon}>
                    <a href={x.href} target="_blank" rel="noopener noreferrer" aria-label={x.label}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-md ring-1 ring-white/15 hover:text-trace-bright hover:ring-trace-bright">
                      <Icon name={x.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <nav aria-label={t.footer.explore}>
          <h2 className="mb-3 font-display text-[16px] font-semibold text-white">{t.footer.explore}</h2>
          <ul className="space-y-1 text-[15px]">
            {navItems(t).map((i) => <li key={i.to}><Link to={i.to} className="inline-block py-1 hover:text-trace-bright">{i.label}</Link></li>)}
            <li><Link to="/privacy" className="inline-block py-1 hover:text-trace-bright">{t.contact.privacyLink}</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 font-display text-[16px] font-semibold text-white">{t.footer.courses}</h2>
          <ul className="space-y-1 text-[15px]">
            {(courses.data ?? []).slice(0, 6).map((c) => (
              <li key={c.id}><Link to={`/courses/${c.slug}`} className="inline-block py-1 hover:text-trace-bright">{pick(c, 'course_name')}</Link></li>
            ))}
            <li><Link to="/courses" className="inline-block py-1 text-trace-bright hover:underline">{t.courses.all}</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="mb-3 font-display text-[16px] font-semibold text-white">{t.footer.contact}</h2>
          <ul className="space-y-3 text-[15px]">
            {address.text && <li className="flex gap-3"><Icon name="pin" className="mt-1 h-5 w-5 shrink-0 text-trace-bright" /><span lang={address.lang} className="whitespace-pre-line">{address.text}</span></li>}
            {s?.phone && <li><a href={telHref(s.phone)} className="flex items-center gap-3 hover:text-trace-bright"><Icon name="phone" className="h-5 w-5 text-trace-bright" /><span className="tabular-nums">{s.phone}</span></a></li>}
            {s?.whatsapp && <li><a href={whatsappHref(s.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-trace-bright"><Icon name="whatsapp" className="h-5 w-5 text-led" />{t.contact.whatsapp}</a></li>}
            {s?.email && <li><a href={`mailto:${s.email}`} className="flex items-center gap-3 break-all hover:text-trace-bright"><Icon name="mail" className="h-5 w-5 shrink-0 text-trace-bright" />{s.email}</a></li>}
          </ul>
          <div className="mt-6"><LanguageSwitcher size="sm" /></div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-wrap items-center justify-between gap-2 py-5 text-[14px] text-white/55">
          {/* The footer line is editable in the Admin Dashboard (Settings → Home page → Footer text). */}
          <p lang={footer.text ? footer.lang : undefined}>{footer.text || `© ${new Date().getFullYear()} ${pick(s, 'center_name') || 'M.Power Engineering'}. ${t.footer.rights}`}</p>
        </div>
      </div>
    </footer>
  );
}
