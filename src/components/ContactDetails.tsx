import type { ReactNode } from 'react';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/hooks/useSettings';
import { isSafeUrl, telHref, whatsappHref } from '@/utils/contact';
import { Icon, type IconName } from './ui/Icon';

/** Every way to reach the center, as large tappable rows with icons. */
export function ContactDetails() {
  const { t, pickL } = useI18n();
  const s = useSettings();
  const address = pickL(s, 'address');
  const hours = pickL(s, 'opening_hours');

  const rows: Array<{ icon: IconName; label: string; value: ReactNode; href?: string; external?: boolean; tone?: string; lang?: string }> = [];
  if (address.text) rows.push({ icon: 'pin', label: t.contact.address, value: address.text, lang: address.lang,
    href: isSafeUrl(s?.google_maps_url) ? s!.google_maps_url : undefined, external: true });
  if (s?.phone) rows.push({ icon: 'phone', label: t.contact.phone, value: <span className="tabular-nums">{s.phone}</span>, href: telHref(s.phone) });
  if (s?.whatsapp) rows.push({ icon: 'whatsapp', label: t.contact.whatsapp, value: <span className="tabular-nums">{s.whatsapp}</span>, href: whatsappHref(s.whatsapp), external: true, tone: 'text-led-dark' });
  if (s?.email) rows.push({ icon: 'mail', label: t.contact.email, value: <span className="break-all">{s.email}</span>, href: `mailto:${s.email}` });
  if (isSafeUrl(s?.facebook_url)) rows.push({ icon: 'facebook', label: t.contact.facebook, value: s!.facebook_url.replace(/^https?:\/\/(www\.)?/, ''), href: s!.facebook_url, external: true });
  if (isSafeUrl(s?.messenger_url)) rows.push({ icon: 'messenger', label: t.contact.messenger, value: s!.messenger_url.replace(/^https?:\/\/(www\.)?/, ''), href: s!.messenger_url, external: true });
  if (hours.text) rows.push({ icon: 'clock', label: t.contact.hours, value: hours.text, lang: hours.lang });

  if (!rows.length) return <p className="text-ink-muted">{t.contact.noDetails}</p>;

  return (
    <ul className="divide-y divide-line rounded-lg border border-line bg-white">
      {rows.map((r) => {
        const body = (
          <>
            <span className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-trace-soft ${r.tone ?? 'text-trace-dark'}`}>
              <Icon name={r.icon} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] text-ink-muted">{r.label}</span>
              <span className="block whitespace-pre-line font-medium text-ink" lang={r.lang}>{r.value}</span>
            </span>
            {r.href && <Icon name={r.external ? 'external' : 'right'} className="mt-3 h-4 w-4 shrink-0 text-ink-muted" />}
          </>
        );
        return (
          <li key={r.label}>
            {r.href ? (
              <a href={r.href} {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex min-h-[64px] items-start gap-4 px-4 py-3 hover:bg-trace-soft/40">{body}</a>
            ) : <div className="flex min-h-[64px] items-start gap-4 px-4 py-3">{body}</div>}
          </li>
        );
      })}
    </ul>
  );
}
