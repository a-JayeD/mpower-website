import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';

/** Dark band at the top of inner pages: breadcrumb, title, one-line intro. */
export function PageHeader({ title, intro, crumbs = [], titleLang, children }: {
  title: string; intro?: ReactNode; crumbs?: Array<{ to: string; label: string }>; titleLang?: string; children?: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <header className="on-dark tech-grid relative overflow-hidden bg-board text-white">
      <div className="container-x relative py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-4 text-[15px] text-white/65">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li><Link to="/" className="hover:text-trace-bright">{t.nav.home}</Link></li>
            {crumbs.map((c) => (
              <li key={c.to} className="flex items-center gap-2">
                <span aria-hidden className="text-white/35">/</span>
                <Link to={c.to} className="hover:text-trace-bright">{c.label}</Link>
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="max-w-4xl text-[2rem] font-semibold leading-tight text-white sm:text-[2.6rem]" lang={titleLang}>{title}</h1>
        {/* the site's trace motif: a short lit trace ending in a via */}
        <svg aria-hidden className="mt-5 h-3 w-40 text-trace" viewBox="0 0 160 12">
          <path d="M0 9h118l5-5h23" fill="none" stroke="currentColor" strokeWidth="2" pathLength={1} className="trace-draw" style={{ ['--len' as string]: 1 }} />
          <circle cx="150" cy="4" r="3" fill="#0A1A33" stroke="currentColor" strokeWidth="2" />
        </svg>
        {intro && <p className="mt-5 max-w-prose text-[17px] text-white/80">{intro}</p>}
        {children}
      </div>
    </header>
  );
}
