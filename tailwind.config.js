/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,js,jsx,ts,tsx,vue,svelte,md}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        jetbrains: [
          "JetBrains Mono",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
      animation: {
        blink: "blinkAnimation 1s step-start infinite",
        "fade-in": "fadeIn 0.3s ease-out",
      },
      keyframes: {
        blinkAnimation: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
