/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,js,jsx,ts,tsx,vue,svelte}"],
  theme: {
    extend: {
      colors: {
        backgroundDark: "#1e1e1e",
        backgroundLight: "#f9f9f9",
        textLight: "#ffffff",
        textDark: "#1e1e1e",

        accentBlue: "#4FC1FF",
        accentPurple: "#C586C0",
        accentGreen: "#B5CEA8",

        grayDark: "#2D2D2D",
        grayLight: "#d4d4d4",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
