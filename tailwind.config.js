/** @type {import('tailwindcss').Config} */

// The palette, radii and type scale are overridden at the token level rather
// than by rewriting several hundred utility classes across the components.
// Tailwind's stock indigo and generous corner radii are the two things that
// make a site look like every other Tailwind site; redefining what those
// tokens mean changes the whole surface from one place.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep petrol — a considered, ledger-ish blue-green that suits tax and
        // money without reaching for the default purple every Tailwind site uses.
        indigo: {
          50:  '#EDF4F6',
          100: '#D6E6EB',
          200: '#AECCD5',
          300: '#79A9B7',
          400: '#4A8497',
          500: '#2C6A7E',
          600: '#1C5268',
          700: '#164254',
          800: '#103240',
          900: '#0B242E',
        },
      },
      borderRadius: {
        // Tight, precise corners. A tax table should look measured, not soft.
        DEFAULT: '2px',
        sm: '2px',
        md: '3px',
        lg: '3px',
        xl: '4px',
        '2xl': '5px',
        '3xl': '6px',
      },
      fontFamily: {
        // A serif display face carries more authority for tax content than
        // another geometric sans, and uses faces already on the device so it
        // costs no network request and cannot flash a fallback.
        display: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
      },
    },
  },
  plugins: [],
}
