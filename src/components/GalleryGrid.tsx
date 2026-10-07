import { useCallback, useState } from 'react';
import { mediaUrl } from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import type { GalleryImage } from '@/types/content';
import { Lightbox } from './Lightbox';

/**
 * Masonry grid of thumbnails (≈480 px, ~30 KB each). The full 1600 px photo
 * is only downloaded when someone opens it in the viewer.
 */
export function GalleryGrid({ images, total }: { images: GalleryImage[]; total?: number }) {
  const { pickL, num, t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <>
      <ul className="columns-2 gap-3 sm:columns-3 lg:columns-4">
        {images.map((img, i) => {
          const cap = pickL(img, 'caption');
          const ratio = img.width && img.height ? `${img.width}/${img.height}` : '4/3';
          return (
            <li key={img.id} className="mb-3 break-inside-avoid">
              <button type="button" onClick={() => setOpen(i)}
                className="group relative block w-full overflow-hidden rounded-md bg-board/10 focus-visible:ring-2 focus-visible:ring-trace focus-visible:ring-offset-2"
                aria-label={cap.text || t.gallery.openPhoto(num(i + 1))}>
                <img src={mediaUrl(img.thumb_path) ?? ''} alt={cap.text} loading="lazy" decoding="async"
                  style={{ aspectRatio: ratio }} className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </button>
            </li>
          );
        })}
      </ul>
      {open !== null && <Lightbox images={images} index={open} total={total ?? images.length} onIndex={setOpen} onClose={close} />}
    </>
  );
}
