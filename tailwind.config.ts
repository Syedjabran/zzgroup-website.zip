import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        soft: 'var(--bg-soft)',
        sky: 'var(--sky)',
        'deep-blue': 'var(--deep-blue)',
        charcoal: 'var(--charcoal)',
        grey: 'var(--grey)',
        border: 'var(--border)',
        whatsapp: 'var(--whatsapp)',
        error: 'var(--error)'
      },
      borderRadius: { DEFAULT: 'var(--radius)' },
      maxWidth: { content: 'var(--maxw)' }
    }
  },
  plugins: []
};
export default config;
