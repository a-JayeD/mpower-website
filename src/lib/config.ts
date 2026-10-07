const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  // Fail loudly during setup instead of showing an empty site.
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.local.');
}

export const config = {
  supabaseUrl: url ?? '',
  supabaseKey: key ?? '',
  /** Final public address (no trailing slash) or the current origin. */
  siteUrl: (import.meta.env.VITE_SITE_URL?.replace(/\/$/, '') || (typeof window !== 'undefined' ? window.location.origin : '')),
  mediaBucket: 'public-media',
};
