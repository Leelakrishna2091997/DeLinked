/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#3B82F6', // blue-500
            dark: '#2563EB', // blue-600
          },
          secondary: {
            DEFAULT: '#10B981', // emerald-500
          },
        },
      },
    },
    plugins: [],
  }