import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { mediaUrl } from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import { useDialog } from '@/hooks/useDialog';
import type { GalleryImage } from '@/types/content';
import { Icon } from './ui/Icon';

/** Accessible photo viewer: arrow keys, swipe, Escape; preloads the neighbouring photos only. */
export function Lightbox({ images, index, total, onIndex, onClose }: {
  images: GalleryImage[]; index: number; total: number; onIndex: (i: number) => void; onClose: () => void;
}) {
  const { t, pickL, num } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const touchX = useRef<number | null>(null);
  useDialog(true, ref, onClose);

  const img = images[index];
  const cap = pickL(img, 'caption');
  const go = useCallback((d: number) => {
    const n = images.length;
    onIndex((index + d + n) % n);
  }, [images.length, index, onIndex]);

  useEffect(() => {
    setLoaded(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    // Warm the cache for the next and previous photos.
    for (const d of [1, -1]) {
      const n = images[(index + d + images.length) % images.length];
      if (n) new Image().src = mediaUrl(n.image_path) ?? '';
    }
    return () => document.removeEventListener('keydown', onKey);
  }, [index, go, images]);

  return createPortal(
    <div ref={ref} role="dialog" aria-modal="true" aria-label={t.gallery.lightbox}
      className="on-dark fixed inset-0 z-[70] flex animate-fadein flex-col bg-board/95 text-white"
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}>
      <div className="flex min-h-[64px] items-center justify-between px-4">
        <p className="text-[15px] text-white/75" aria-live="polite">{t.gallery.counter(num(index + 1), num(total))}</p>
        <button type="button" onClick={onClose} data-autofocus aria-label={t.gallery.close}
          className="inline-flex h-12 w-12 items-center justify-center rounded-md ring-1 ring-white/20 hover:ring-trace-bright">
          <Icon name="close" className="h-6 w-6" />
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16" onClick={(e) => e.target === e.currentTarget && onClose()}>
        {!loaded && <img src={mediaUrl(img.thumb_path) ?? ''} alt="" aria-hidden className="absolute max-h-full max-w-full scale-100 object-contain opacity-60 blur-sm" />}
        <img key={img.id} src={mediaUrl(img.image_path) ?? ''} alt={cap.text} onLoad={() => setLoaded(true)}
          className="relative max-h-full max-w-full object-contain transition-opacity duration-200" style={{ opacity: loaded ? 1 : 0 }} />
        {images.length > 1 && <>
          <button type="button" onClick={() => go(-1)} aria-label={t.gallery.prev}
            className="absolute left-2 top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-board/70 ring-1 ring-white/20 hover:ring-trace-bright sm:inline-flex">
            <Icon name="left" className="h-7 w-7" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label={t.gallery.next}
            className="absolute right-2 top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-board/70 ring-1 ring-white/20 hover:ring-trace-bright sm:inline-flex">
            <Icon name="right" className="h-7 w-7" />
          </button>
        </>}
      </div>
      <div className="flex min-h-[72px] items-center gap-3 px-4 py-3">
        {images.length > 1 && (
          <button type="button" onClick={() => go(-1)} aria-label={t.gallery.prev} className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md ring-1 ring-white/20 sm:hidden">
            <Icon name="left" className="h-6 w-6" />
          </button>
        )}
        <p className="flex-1 text-center text-[15px] text-white/85" lang={cap.lang}>{cap.text}</p>
        {images.length > 1 && (
          <button type="button" onClick={() => go(1)} aria-label={t.gallery.next} className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md ring-1 ring-white/20 sm:hidden">
            <Icon name="right" className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}
