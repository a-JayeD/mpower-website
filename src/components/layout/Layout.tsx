import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

function PageFallback() {
  return <div className="min-h-[60vh]" aria-busy="true" />;
}

export function Layout() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);

  // On navigation: start at the top and move focus to the page, so screen-reader
  // and keyboard users land on the new content instead of the old link.
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only z-[60] rounded bg-white px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:left-3 focus:top-3">{t.nav.skip}</a>
      <Navbar />
      <main id="main" ref={main} tabIndex={-1} className="flex-1 outline-none">
        <Suspense fallback={<PageFallback />}><Outlet /></Suspense>
      </main>
      <Footer />
    </div>
  );
}
