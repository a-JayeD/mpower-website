import { Fragment, type ReactNode } from 'react';
import { isSafeUrl } from './contact';

/** Split admin-entered plain text into paragraphs (blank line = new paragraph). */
export function paragraphs(text: string): string[] {
  return text.replace(/\r\n/g, '\n').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

const URL_RE = /(https?:\/\/[^\s<>"')]+[^\s<>"').,;:!?])/g;

/** Plain text with http(s) links made clickable. Everything else stays text (React escapes it). */
export function linkify(text: string): ReactNode {
  const parts = text.split(URL_RE);
  return parts.map((part, i) =>
    i % 2 === 1 && isSafeUrl(part)
      ? <a key={i} href={part} target="_blank" rel="noopener noreferrer nofollow" className="break-all text-trace-dark underline underline-offset-2 hover:text-ink">{part}</a>
      : <Fragment key={i}>{part}</Fragment>,
  );
}

/** Render admin text as paragraphs, keeping single line breaks. */
export function RichText({ text, className, lang }: { text: string; className?: string; lang?: string }) {
  return (
    <div className={className} lang={lang}>
      {paragraphs(text).map((p, i) => <p key={i} className="whitespace-pre-line">{linkify(p)}</p>)}
    </div>
  );
}

export function excerpt(text: string, max = 150): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,.;:।–-]+$/, '')}…`;
}
