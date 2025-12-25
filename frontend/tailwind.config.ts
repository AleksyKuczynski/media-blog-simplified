// tailwind.config.ts - SIMPLIFIED
import type { Config } from 'tailwindcss';

interface PluginAPI {
  addVariant: (name: string, definition: string) => void;
}

const config: Config = {
  darkMode: 'media',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Rounded theme spacing constants
      spacing: {
        'caption-3line': 'var(--caption-three-line-height)',
      },
      
      // Rounded theme border radius (only these values)
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',
        'DEFAULT': '0.5rem', 
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
        'full': '9999px',
      },
      
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        display: ['var(--font-display)'],
        custom: ['var(--font-custom)'],
      },

      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },

      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
      
      colors: {
        // Surface colors (Material 3)
        sf: {
          DEFAULT: 'var(--color-surface)',
          cont: 'var(--color-surface-container)',
          hi: 'var(--color-surface-container-high)',
          hst: 'var(--color-surface-container-highest)',
        },
        
        // Primary colors
        pr: {
          cont: 'var(--color-primary-container)',
          fix: 'var(--color-primary-fixed)',
          dim: 'var(--color-primary-fixed-dim)',
          sf: 'var(--color-primary-surface)',
          inv: 'var(--color-primary-container-inverted)',
          'fix-inv': 'var(--color-primary-fixed-inverted)',
          'dim-inv': 'var(--color-primary-fixed-dim-inverted)',
        },
        
        // Secondary colors
        sec: {
          cont: 'var(--color-secondary-container)',
          fix: 'var(--color-secondary-fixed)',
          dim: 'var(--color-secondary-fixed-dim)',
          sf: 'var(--color-secondary-surface)',
        },
        
        // Tertiary colors
        tr: {
          cont: 'var(--color-tertiary-container)',
          fix: 'var(--color-tertiary-fixed)',
          dim: 'var(--color-tertiary-fixed-dim)',
          sf: 'var(--color-tertiary-surface)',
        },
        
        // Text colors
        on: {
          sf: 'var(--color-on-surface)',
          'sf-var': 'var(--color-on-surface-variant)',
          pr: 'var(--color-on-primary-container)',
          'pr-var': 'var(--color-on-primary-container-variant)',
          sec: 'var(--color-on-secondary-container)',
          'sec-var': 'var(--color-on-secondary-container-variant)',
          tr: 'var(--color-on-tertiary-container)',
          'tr-var': 'var(--color-on-tertiary-container-variant)',
        },
        
        // Outline colors
        ol: {
          DEFAULT: 'var(--color-outline)',
          var: 'var(--color-outline-variant)',
        },

        // Direct color values
        success: '#06D6A0',
        error: '#EF476F',
        warning: '#FFC43D',
        info: '#118AB2',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;