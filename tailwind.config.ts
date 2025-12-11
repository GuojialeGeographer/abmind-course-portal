import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Chinese font optimization with fallbacks
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          // Chinese fonts
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'SimSun',
          'sans-serif',
          // Emoji fonts
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
        // Monospace fonts with Chinese support
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
          // Chinese monospace
          'PingFang SC',
          'Microsoft YaHei',
        ],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      // Optimize for Chinese text rendering
      letterSpacing: {
        chinese: '0.05em',
      },
      lineHeight: {
        chinese: '1.8',
      },
    },
  },
  plugins: [],
};

export default config;
