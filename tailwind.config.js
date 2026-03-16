/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0a0a",
          secondary: "#111111",
          card: "#1a1a1a",
          elevated: "#222222",
        },
        red: {
          primary: "#c41e3a",
          dark: "#8b0000",
          light: "#e63946",
          glow: "rgba(196, 30, 58, 0.4)",
        },
        gold: {
          DEFAULT: "#d4a853",
          light: "#f0d68a",
        },
        text: {
          primary: "#f0e6d3",
          secondary: "#a09888",
          muted: "#666",
        },
        glass: {
          bg: "rgba(20, 20, 20, 0.7)",
          border: "rgba(196, 30, 58, 0.2)",
          "bg-red": "rgba(196, 30, 58, 0.08)",
        }
      },
      fontFamily: {
        heading: ['"Bebas Neue"', "sans-serif"],
        body: ['"Inter"', "sans-serif"],
        accent: ['"Outfit"', "sans-serif"],
      },
      boxShadow: {
        'red': '0 0 30px rgba(196, 30, 58, 0.15)',
        'dark': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
