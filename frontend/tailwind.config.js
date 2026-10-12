/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          750: '#293548',
          850: '#172033',
        },
        dark: {
          bg: '#0b0f19',
          card: '#111827',
          surface: '#1e293b',
          border: '#1f293d',
        },
      },
    },
  },
  plugins: [],
}
