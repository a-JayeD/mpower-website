/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep navy "circuit board"
        board: { DEFAULT: '#0A1A33', 2: '#10264A', 3: '#183460', line: '#25467A' },
        // Cool off-white surfaces (deliberately not cream)
        paper: '#F4F7FB',
        line: '#DCE3EE',
        ink: { DEFAULT: '#0F1E36', soft: '#3A4A63', muted: '#52627A' },
        // Electric cyan "copper trace" — bright for dark grounds, dark for text on white
        trace: { DEFAULT: '#1AAFD8', bright: '#5BD3F2', dark: '#0A7499', soft: '#E3F5FB' },
        // Status-LED green, used sparingly
        led: { DEFAULT: '#22A867', dark: '#157A4A', soft: '#E3F5EC' },
      },
      fontFamily: {
        // Plex has no Bengali glyphs, so Bangla text falls through to Hind Siliguri per glyph.
        sans: ['"IBM Plex Sans"', '"Hind Siliguri"', 'system-ui', 'sans-serif'],
        display: ['"IBM Plex Sans Condensed"', '"Hind Siliguri"', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: { content: '76rem', prose: '42rem' },
      boxShadow: {
        card: '0 1px 0 rgba(15,30,54,0.04), 0 8px 24px -16px rgba(15,30,54,0.25)',
        lift: '0 18px 48px -20px rgba(10,26,51,0.45)',
      },
      keyframes: {
        draw: { to: { strokeDashoffset: '0' } },
        travel: { '0%': { offsetDistance: '0%', opacity: '0' }, '8%': { opacity: '1' }, '92%': { opacity: '1' }, '100%': { offsetDistance: '100%', opacity: '0' } },
        glow: { '0%,100%': { opacity: '0.35' }, '50%': { opacity: '1' } },
        fadein: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        draw: 'draw 1.8s cubic-bezier(.6,.1,.2,1) forwards',
        glow: 'glow 2.6s ease-in-out infinite',
        fadein: 'fadein .2s ease-out',
      },
    },
  },
  plugins: [],
};
