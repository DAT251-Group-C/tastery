/** @type {import('tailwindcss').Config} */
const baseConfig = {
  content: ['apps/app/src/**/*.{vue,js,ts,scss,css}', 'apps/app/index.html'],
  theme: {
    borderRadius: {
      none: '0',
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      full: '9999px',
    },
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
      symbol: ['Material Symbols Rounded'],
      'symbol-filled': ['Material Symbols Rounded'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      neutral: {
        100: 'rgb(var(--color-neutral-100) / <alpha-value>)',
        200: 'rgb(var(--color-neutral-200) / <alpha-value>)',
        300: 'rgb(var(--color-neutral-300) / <alpha-value>)',
        400: 'rgb(var(--color-neutral-400) / <alpha-value>)',
        500: 'rgb(var(--color-neutral-500) / <alpha-value>)',
        600: 'rgb(var(--color-neutral-600) / <alpha-value>)',
        700: 'rgb(var(--color-neutral-700) / <alpha-value>)',
        800: 'rgb(var(--color-neutral-800) / <alpha-value>)',
        900: 'rgb(var(--color-neutral-900) / <alpha-value>)',
      },
      primary: {
        light: 'rgb(var(--color-primary-light) / <alpha-value>)',
        DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
        dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
        darker: 'rgb(var(--color-primary-darker) / <alpha-value>)',
      },
      secondary: {
        light: 'rgb(var(--color-secondary-light) / <alpha-value>)',
        DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
      },
      accent: {
        DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
      },
      error: {
        DEFAULT: 'rgb(var(--color-error) / <alpha-value>)',
        dark: 'rgb(var(--color-error-dark) / <alpha-value>)',
      },
      success: {
        DEFAULT: 'rgb(var(--color-success) / <alpha-value>)',
        dark: 'rgb(var(--color-success-dark) / <alpha-value>)',
      },
      warning: {
        DEFAULT: 'rgb(var(--color-warning) / <alpha-value>)',
        dark: 'rgb(var(--color-warning-dark) / <alpha-value>)',
      },
      info: {
        DEFAULT: 'rgb(var(--color-info) / <alpha-value>)',
        dark: 'rgb(var(--color-info-dark) / <alpha-value>)',
      },
    },
    fontSize: {
      h1: [
        '2rem',
        {
          fontWeight: '500',
          lineHeight: '1.25',
          letterSpacing: '0.008rem',
        },
      ],
      h2: [
        '1.5rem',
        {
          fontWeight: '500',
          lineHeight: '1.5',
          letterSpacing: '0.006rem',
        },
      ],
      h3: [
        '1.5rem',
        {
          fontWeight: '500',
          lineHeight: '1.2',
          letterSpacing: '0.006rem',
        },
      ],
      'body-large-bold': [
        '1.25rem',
        {
          fontWeight: '500',
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
          fontWeight: '500',
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
          fontWeight: '600',
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
          fontWeight: '400',
          lineHeight: '1.5',
          letterSpacing: '0.004rem',
        },
      ],
      'button-small': [
        '0.875rem',
        {
          fontWeight: '400',
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
  },
};

export default baseConfig;
