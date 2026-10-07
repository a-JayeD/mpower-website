/**
 * Small inline icon set (no icon library = less JavaScript to download).
 * Line icons use a 24×24 grid with 1.75 stroke; brand icons are filled.
 */
import type { SVGProps } from 'react';

const line: Record<string, string> = {
  phone: 'M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2',
  mail: 'M4 6h16v12H4z M4 7l8 6 8-6',
  pin: 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
  close: 'M6 6l12 12 M18 6L6 18',
  left: 'M15 6l-6 6 6 6',
  right: 'M9 6l6 6-6 6',
  down: 'M6 9l6 6 6-6',
  arrowLeft: 'M19 12H5 M11 6l-6 6 6 6',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M20 20l-4-4',
  copy: 'M9 9h10v11H9z M5 15V4h10',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  share: 'M12 4v11 M7.5 8.5L12 4l4.5 4.5 M5 13v6h14v-6',
  external: 'M14 4h6v6 M20 4l-9 9 M18 14v5H5V6h5',
  calendar: 'M4 6h16v14H4z M4 10h16 M8 3v5 M16 3v5',
  layers: 'M12 4l9 5-9 5-9-5z M3 14l9 5 9-5',
  bolt: 'M13 3L5 13h6l-1 8 8-10h-6z',
  image: 'M4 5h16v14H4z M4 16l5-5 4 4 3-3 4 4 M15.5 9.5a1.5 1.5 0 1 0 0-.01',
  alert: 'M12 4l9 16H3z M12 10v4 M12 17v.5',
};

const brand: Record<string, string> = {
  facebook: 'M14 8.5V6.8c0-.8.5-1.3 1.4-1.3H17V2.2C16.4 2.1 15.3 2 14.1 2 11.6 2 10 3.5 10 6.3v2.2H7.3v3.7H10V22h4v-9.8h2.8l.5-3.7z',
  whatsapp: 'M12 2.2A9.7 9.7 0 0 0 3.6 16.9L2.3 21.7l4.9-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.2.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.1 1.6 2.5 4 3.5 1.5.6 2.1.7 2.8.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.4-.2z',
  messenger: 'M12 2.5C6.7 2.5 2.5 6.4 2.5 11.5c0 2.7 1.1 5 3 6.6v3.4l3.2-1.8c1 .3 2.1.4 3.3.4 5.3 0 9.5-3.9 9.5-9S17.3 2.5 12 2.5zm1 12l-2.4-2.6-4.7 2.6 5.2-5.5 2.5 2.6 4.6-2.6z',
  youtube: 'M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8zM10 15V9l5.2 3z',
};

export type IconName = keyof typeof line | keyof typeof brand;

export function Icon({ name, className = 'h-5 w-5', ...rest }: { name: IconName } & SVGProps<SVGSVGElement>) {
  const filled = name in brand;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false"
      fill={filled ? 'currentColor' : 'none'} stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d={filled ? brand[name] : line[name]} />
    </svg>
  );
}
