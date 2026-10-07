import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { useSettings } from '@/hooks/useSettings';
import { isMapEmbed, isSafeUrl } from '@/utils/contact';
import { Icon } from './ui/Icon';

/**
 * Free Google Maps embed (the "Share → Embed a map" link; no API key).
 * The map only loads after a tap, so it costs nothing for visitors who don't need it.
 */
export function MapEmbed() {
  const { t } = useI18n();
  const s = useSettings();
  const [show, setShow] = useState(false);
  const embed = isMapEmbed(s?.map_embed_url) ? s!.map_embed_url : null;
  const link = isSafeUrl(s?.google_maps_url) ? s!.google_maps_url : null;
  if (!embed && !link) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white">
      {embed && (show ? (
        <iframe src={embed} title={t.contact.map} className="block aspect-[4/3] w-full border-0 sm:aspect-[16/10]"
          loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <button type="button" onClick={() => setShow(true)}
          className="tech-grid relative flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 bg-board text-white sm:aspect-[16/10]">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-trace text-board"><Icon name="pin" className="h-7 w-7" /></span>
          <span className="font-medium">{t.contact.showMap}</span>
        </button>
      ))}
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="flex min-h-[52px] items-center justify-center gap-2 border-t border-line font-medium text-trace-dark hover:bg-trace-soft/40">
          <Icon name="external" className="h-4 w-4" />{embed ? t.contact.openMap : t.contact.getDirections}
        </a>
      )}
    </div>
  );
}
