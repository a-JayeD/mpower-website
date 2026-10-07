import type { Dict } from '@/lib/i18n/en';

export const navItems = (t: Dict) => [
  { to: '/', label: t.nav.home, end: true },
  { to: '/about', label: t.nav.about },
  { to: '/courses', label: t.nav.courses },
  { to: '/instructors', label: t.nav.instructors },
  { to: '/gallery', label: t.nav.gallery },
  { to: '/updates', label: t.nav.updates },
  { to: '/success-stories', label: t.nav.stories },
  { to: '/faq', label: t.nav.faq },
  { to: '/contact', label: t.nav.contact },
];
