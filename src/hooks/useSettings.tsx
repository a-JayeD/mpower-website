import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { getSettings } from '@/services/content';
import type { SiteSettings } from '@/types/content';
import { useData } from './useData';

const SNAPSHOT = 'mpower-settings-v1';
const Ctx = createContext<SiteSettings | null>(null);

function snapshot(): SiteSettings | null {
  try { return JSON.parse(localStorage.getItem(SNAPSHOT) ?? 'null'); } catch { return null; }
}

/**
 * Site-wide settings (name, contact details, links) load once per visit.
 * The last copy is kept in the browser so the header and footer show
 * the phone number instantly on repeat visits, then refresh quietly.
 */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const { data } = useData('settings', getSettings);
  useEffect(() => {
    if (data) try { localStorage.setItem(SNAPSHOT, JSON.stringify(data)); } catch { /* ignore */ }
  }, [data]);
  return <Ctx.Provider value={data ?? snapshot()}>{children}</Ctx.Provider>;
}

export function useSettings(): SiteSettings | null {
  return useContext(Ctx);
}
