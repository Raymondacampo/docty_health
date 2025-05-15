/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{html,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'diagonal-move': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(7px, 7px)' }, // subtle diagonal shift
        },
      },
      animation: {
        'slide-up': 'slide-up 1s ease-out forwards',
        'diagonal-move': 'diagonal-move 3s ease-in-out infinite',
      },
    },
    screens: {
      xs: '0px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    }
  },
  plugins: [],
};
