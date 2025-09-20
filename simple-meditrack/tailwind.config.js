/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          blue: '#E6F3FF',
          darkblue: '#2563EB',
          green: '#10B981',
          lightgreen: '#ECFDF5',
          gray: '#F8FAFC',
          darkgray: '#475569'
        }
      }
    },
  },
  plugins: [],
}