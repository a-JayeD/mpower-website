import { useEffect, type RefObject } from 'react';

/**
 * Behaviour shared by the mobile menu and the photo viewer:
 * Escape closes, Tab stays inside, page behind does not scroll,
 * and focus returns to the button that opened it.
 */
export function useDialog(open: boolean, ref: RefObject<HTMLElement>, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusables = () => Array.from(
      ref.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])') ?? [],
    ).filter((el) => el.offsetParent !== null || el === document.activeElement);

    requestAnimationFrame(() => (ref.current?.querySelector<HTMLElement>('[data-autofocus]') ?? focusables()[0])?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab') return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [open, ref, onClose]);
}
