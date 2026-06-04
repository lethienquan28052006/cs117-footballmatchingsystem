/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: "#0f7a4f",
        navy: "#123c69",
        sun: "#ffd23f",
      },
      boxShadow: {
        sport: "0 14px 40px rgba(18, 60, 105, 0.14)",
      },
    },
  },
  plugins: [],
};
