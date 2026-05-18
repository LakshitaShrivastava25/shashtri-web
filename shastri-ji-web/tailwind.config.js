/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F8EFE3",
        surface: "#FFF6EA",
        "surface-alt": "#EED9C4",
        gold: "#F4A623",
        "gold-light": "#FFD27F",
        "gold-bg": "#FFF0D0",
        border: "#E6C79C",
        "border-light": "#F0DDB8",
        "text-dark": "#5C3A1E",
        "text-mid": "#8B6F47",
        "text-light": "#B8956A",
        error: "#C62828",
        success: "#2E7D32",
        warning: "#E65100",
        info: "#6A1B9A",
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        sans: ['Poppins', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}
