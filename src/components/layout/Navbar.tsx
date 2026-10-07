import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/hooks/useSettings';
import { useDialog } from '@/hooks/useDialog';
import { telHref, whatsappHref } from '@/utils/contact';
import { cn } from '@/utils/cn';
import { Icon } from '@/components/ui/Icon';
import { Brand } from './Brand';
import { LanguageSwitcher } from './LanguageSwitcher';
import { navItems } from './navItems';

export function Navbar() {
  const { t, pick } = useI18n();
  const s = useSettings();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const items = navItems(t);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      {/* Utility bar: phone, WhatsApp and the language switch, always within reach */}
      <div className="on-dark border-b border-white/10 bg-board text-[14px] text-white/75">
        <div className="container-x flex min-h-[48px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-6">
            {s?.phone && (
              <a href={telHref(s.phone)} className="inline-flex items-center gap-2 hover:text-white">
                <Icon name="phone" className="h-4 w-4 text-trace-bright" /><span className="tabular-nums">{s.phone}</span>
              </a>
            )}
            {s?.whatsapp && (
              <a href={whatsappHref(s.whatsapp)} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 hover:text-white sm:inline-flex">
                <Icon name="whatsapp" className="h-4 w-4 text-led" />{t.contact.whatsapp}
              </a>
            )}
            {pick(s, 'opening_hours') && (
              <span className="hidden items-center gap-2 lg:inline-flex"><Icon name="clock" className="h-4 w-4 text-white/50" />{pick(s, 'opening_hours')}</span>
            )}
          </div>
          <LanguageSwitcher size="sm" />
        </div>
      </div>

      <header className="on-dark sticky top-0 z-40 border-b border-white/10 bg-board/95 text-white backdrop-blur supports-[backdrop-filter]:bg-board/85">
        <div className="container-x flex min-h-[68px] items-center gap-4">
          <Brand />
          <nav aria-label={t.nav.main} className="ml-auto hidden xl:block">
            <ul className="flex items-center">
              {items.map((i) => (
                <li key={i.to}>
                  <NavLink to={i.to} end={i.end}
                    className={({ isActive }) => cn(
                      'relative flex min-h-[48px] items-center whitespace-nowrap px-2 text-[15px] transition-colors',
                      isActive ? 'text-white after:absolute after:inset-x-2 after:bottom-2 after:h-0.5 after:rounded after:bg-trace' : 'text-white/75 hover:text-white',
                    )}>
                    {i.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <Link to="/contact" className="btn btn-primary ml-auto hidden whitespace-nowrap px-4 lg:inline-flex xl:ml-2">{t.nav.cta}</Link>
          <div className="ml-auto flex items-center gap-2 lg:ml-0 xl:hidden">
            <button type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-menu"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md px-3 text-white ring-1 ring-white/20 hover:ring-trace-bright">
              <Icon name="menu" className="h-6 w-6" />
              <span className="text-[15px] max-[359px]:sr-only">{t.nav.menu}</span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={open} onClose={close} />
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const s = useSettings();
  const ref = useRef<HTMLDivElement>(null);
  useDialog(open, ref, onClose);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      <div className="absolute inset-0 bg-board/60" onClick={onClose} aria-hidden />
      <div ref={ref} id="mobile-menu" role="dialog" aria-modal="true" aria-label={t.nav.menu}
        className="on-dark tech-grid absolute inset-y-0 right-0 flex w-full max-w-sm animate-fadein flex-col overflow-y-auto bg-board text-white shadow-lift">
        <div className="flex min-h-[68px] items-center justify-between border-b border-white/10 px-5">
          <span className="font-display text-[17px] font-semibold">{t.nav.menu}</span>
          <button type="button" onClick={onClose} data-autofocus
            className="inline-flex h-11 w-11 items-center justify-center rounded-md ring-1 ring-white/20 hover:ring-trace-bright" aria-label={t.nav.closeMenu}>
            <Icon name="close" className="h-6 w-6" />
          </button>
        </div>
        <nav aria-label={t.nav.main} className="px-3 py-3">
          <ul>
            {navItems(t).map((i) => (
              <li key={i.to}>
                <NavLink to={i.to} end={i.end}
                  className={({ isActive }) => cn('flex min-h-[52px] items-center gap-3 rounded-md px-3 text-[18px]',
                    isActive ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white')}>
                  {({ isActive }) => <>
                    <span aria-hidden className={cn('h-2.5 w-2.5 rounded-full border-2', isActive ? 'border-trace-bright bg-trace-bright' : 'border-white/30')} />
                    {i.label}
                  </>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto space-y-4 border-t border-white/10 p-5">
          <LanguageSwitcher />
          <div className="grid gap-2">
            <Link to="/contact" className="btn btn-primary">{t.nav.cta}</Link>
            {s?.phone && <a href={telHref(s.phone)} className="btn btn-ghost-dark"><Icon name="phone" />{t.common.call} {s.phone}</a>}
            {s?.whatsapp && <a href={whatsappHref(s.whatsapp)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp"><Icon name="whatsapp" />{t.common.whatsapp}</a>}
          </div>
        </div>
      </div>
    </div>
  );
}
