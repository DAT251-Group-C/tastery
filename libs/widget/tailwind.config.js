/** @type {import('tailwindcss').Config} */
const baseConfig = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      opacity: {
        disabled: '0.38',
      },
      keyframes: {
        skeleton: {
          '0%': { backgroundColor: 'theme("colors.neutral.light")' },
          '100%': { backgroundColor: 'theme("colors.neutral.white")' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        skeleton: 'skeleton 1s ease-in-out infinite alternate',
        'fade-up': 'fade-up 150ms ease-out forwards',
      },
    },
    borderRadius: {
      none: '0',
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      full: '9999px',
    },
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1400px',
    },
    fontFamily: {
      nunito: ['Nunito Sans', 'sans-serif'],
    },
    boxShadow: {
      lg: '0 6px 18px 4px rgba(35, 35, 42, 0.10)',
      md: '0 4px 8px 2px rgba(35, 35, 42, 0.10)',
      sm: '0 2px 4px 2px rgba(35, 35, 42, 0.08)',
    },
    fontSize: {
      h1: [
        '2rem',
        {
          fontWeight: '700',
          lineHeight: '1.25',
          letterSpacing: '0.008rem',
        },
      ],
      h2: [
        '1.5rem',
        {
          fontWeight: '700',
          lineHeight: '1.5',
          letterSpacing: '0.006rem',
        },
      ],
      h3: [
        '1.5rem',
        {
          fontWeight: '600',
          lineHeight: '1.2',
          letterSpacing: '0.006rem',
        },
      ],
      'body-large-bold': [
        '1.25rem',
        {
          fontWeight: '700',
          lineHeight: '1.4',
          letterSpacing: '0.005rem',
        },
      ],
      'body-large': [
        '1.25rem',
        {
          fontWeight: '400',
          lineHeight: '1.4',
          letterSpacing: '0',
        },
      ],
      'body-bold': [
        '1rem',
        {
          fontWeight: '700',
          lineHeight: '1.5',
          letterSpacing: '0.004rem',
        },
      ],
      body: [
        '1rem',
        {
          fontWeight: '400',
          lineHeight: '1.5',
          letterSpacing: '0',
        },
      ],
      'body-small-bold': [
        '0.875rem',
        {
          fontWeight: '700',
          lineHeight: 'calc(10 / 7)',
          letterSpacing: '0.0035rem',
        },
      ],
      'body-small': [
        '0.875rem',
        {
          fontWeight: '400',
          lineHeight: 'calc(10 / 7)',
          letterSpacing: '0',
        },
      ],
      button: [
        '1rem',
        {
          fontWeight: '500',
          lineHeight: '1.5',
          letterSpacing: '0.004rem',
        },
      ],
      'button-small': [
        '0.875rem',
        {
          fontWeight: '500',
          lineHeight: 'calc(10 / 7)',
          letterSpacing: '0.0035rem',
        },
      ],
      caption: [
        '0.75rem',
        {
          fontWeight: '400',
          lineHeight: '1.3333334',
          letterSpacing: '0',
        },
      ],
    },
    colors: {
      transparent: 'transparent',
      primary: {
        lighter: 'rgb(242 236 248 / <alpha-value>)',
        light: 'rgb(202 180 228 / <alpha-value>)',
        DEFAULT: 'rgb(111 66 154 / <alpha-value>)',
        dark: 'rgb(73 39 112 / <alpha-value>)',
      },
      secondary: {
        lighter: 'rgb(226 233 232 / <alpha-value>)',
        light: 'rgb(169 188 187 / <alpha-value>)',
        DEFAULT: 'rgb(77 100 99 / <alpha-value>)',
        dark: 'rgb(44 58 57 / <alpha-value>)',
      },
      neutral: {
        white: 'rgb(255 255 255 / <alpha-value>)',
        background: 'rgb(248 248 253 / <alpha-value>)',
        lighter: 'rgb(242 242 249 / <alpha-value>)',
        light: 'rgb(211 211 222 / <alpha-value>)',
        medium: 'rgb(104 104 125 / <alpha-value>)',
        dark: 'rgb(35 35 42 / <alpha-value>)',
      },
      semantic: {
        success: {
          light: 'rgb(198 235 226 / <alpha-value>)',
          dark: 'rgb(40 113 95 / <alpha-value>)',
        },
        info: {
          light: 'rgb(217 221 255 / <alpha-value>)',
          dark: 'rgb(0 44 179 / <alpha-value>)',
        },
        warning: {
          light: 'rgb(255 248 181 / <alpha-value>)',
          dark: 'rgb(245 220 25 / <alpha-value>)',
        },
        error: {
          light: 'rgb(255 204 217 / <alpha-value>)',
          dark: 'rgb(179 0 45 / <alpha-value>)',
          darker: 'rgb(102 0 26 / <alpha-value>)',
        },
        focus: 'rgb(81 98 251 / <alpha-value>)',
        link: 'rgb(46 46 184 / <alpha-value>)',
      },
    },
  },
};

export default baseConfig;
