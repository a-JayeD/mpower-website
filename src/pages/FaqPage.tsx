import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { useData } from '@/hooks/useData';
import { useSeo } from '@/hooks/useSeo';
import { useSettings } from '@/hooks/useSettings';
import { listFaqs } from '@/services/content';
import { telHref } from '@/utils/contact';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyBlock, ErrorBlock, Skeleton } from '@/components/ui/Feedback';
import { Icon } from '@/components/ui/Icon';
import { FAQAccordion } from '@/components/FAQAccordion';

export default function FaqPage() {
  const { t } = useI18n();
  const s = useSettings();
  useSeo({});
  const q = useData('faqs', () => listFaqs());
  const [term, setTerm] = useState('');
  const shown = useMemo(() => {
    const needle = term.trim().toLowerCase();
    if (!needle) return q.data ?? [];
    // Search both languages so a visitor finds the answer whatever they type in.
    return (q.data ?? []).filter((f) => [f.question_en, f.question_bn, f.answer_en, f.answer_bn].join(' ').toLowerCase().includes(needle));
  }, [q.data, term]);

  return (
    <>
      <PageHeader title={t.faq.title} intro={t.faq.intro} />
      <div className="container-x grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          {(q.data?.length ?? 0) > 4 && (
            <div className="relative mb-6 max-w-md">
              <label htmlFor="faq-search" className="sr-only">{t.faq.search}</label>
              <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
              <input id="faq-search" type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder={t.faq.search}
                className="h-12 w-full rounded-md border border-line bg-white pl-12 pr-4 text-[17px] focus:border-trace focus:outline-none focus:ring-2 focus:ring-trace/30" />
            </div>
          )}
          {q.error ? <ErrorBlock onRetry={q.retry} />
            : !q.data ? <Skeleton className="h-80" />
            : q.data.length === 0 ? <EmptyBlock>{t.faq.empty}</EmptyBlock>
            : shown.length === 0 ? <EmptyBlock>{t.faq.noMatch}</EmptyBlock>
            : <FAQAccordion faqs={shown} headingLevel={2} />}
        </div>
        <aside className="on-dark self-start rounded-lg bg-board p-6 text-white lg:sticky lg:top-24">
          <h2 className="text-[1.25rem] font-semibold text-white">{t.faq.still}</h2>
          <p className="mt-2 text-white/75">{t.faq.stillBody}</p>
          <div className="mt-5 grid gap-2">
            {s?.phone && <a href={telHref(s.phone)} className="btn btn-primary"><Icon name="phone" />{t.common.call}</a>}
            <Link to="/contact" className="btn btn-ghost-dark">{t.common.sendMessage}</Link>
          </div>
        </aside>
      </div>
    </>
  );
}
