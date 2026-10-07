import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useSeo } from '@/hooks/useSeo';
import { PageHeader } from '@/components/ui/PageHeader';
import { navItems } from '@/components/layout/navItems';

export default function NotFoundPage() {
  const { t } = useI18n();
  useSeo({ title: t.notFound.title, noindex: true });
  return (
    <>
      <PageHeader title={t.notFound.title} intro={t.notFound.body} />
      <div className="container-x py-12">
        <Link to="/" className="btn btn-dark">{t.notFound.home}</Link>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {navItems(t).slice(1).map((i) => <li key={i.to}><Link to={i.to} className="link">{i.label}</Link></li>)}
        </ul>
      </div>
    </>
  );
}
