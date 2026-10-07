/** Helpers that turn the admin's contact settings into working links. */

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

/** wa.me needs the international number without "+" (Bangladesh: 017… → 88017…). */
export function whatsappHref(number: string, text?: string): string {
  let digits = number.replace(/\D/g, '');
  if (digits.startsWith('0')) digits = `88${digits}`;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

export function isSafeUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

/** Only Google's free "Embed a map" iframe URLs are allowed (no Maps API key involved). */
export function isMapEmbed(url: string | null | undefined): url is string {
  return !!url && url.startsWith('https://www.google.com/maps/embed?');
}
