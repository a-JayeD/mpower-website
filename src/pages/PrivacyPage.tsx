import { useI18n } from '@/lib/i18n';
import { useSeo } from '@/hooks/useSeo';
import { PageHeader } from '@/components/ui/PageHeader';

export default function PrivacyPage() {
  const { t } = useI18n();
  useSeo({});
  return (
    <>
      <PageHeader title={t.privacy.title} />
      <div className="container-x py-12 sm:py-16">
        <div className="prose-body max-w-prose text-[17.5px]">{t.privacy.body.map((p) => <p key={p}>{p}</p>)}</div>
      </div>
    </>
  );
}
