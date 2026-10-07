import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Icon } from './ui/Icon';

/** Plain share links (no social SDKs, no tracking). */
export function ShareButtons({ title, url }: { title: string; url: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* clipboard blocked: the URL is still in the address bar */ }
  };
  const cls = 'inline-flex min-h-[44px] items-center gap-2 rounded-md border border-line bg-white px-3 text-[15px] hover:border-trace hover:text-trace-dark';
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[15px] text-ink-muted">{t.updates.share}:</span>
      <a className={cls} href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`} target="_blank" rel="noopener noreferrer" aria-label={t.updates.shareFacebook}>
        <Icon name="facebook" className="h-5 w-5 text-[#1877F2]" />Facebook
      </a>
      <a className={cls} href={`https://wa.me/?text=${enc(`${title}\n${url}`)}`} target="_blank" rel="noopener noreferrer" aria-label={t.updates.shareWhatsapp}>
        <Icon name="whatsapp" className="h-5 w-5 text-led-dark" />WhatsApp
      </a>
      <button type="button" onClick={copy} className={cls}>
        <Icon name={copied ? 'check' : 'copy'} className="h-5 w-5" />
        <span aria-live="polite">{copied ? t.updates.copied : t.updates.copyLink}</span>
      </button>
    </div>
  );
}
