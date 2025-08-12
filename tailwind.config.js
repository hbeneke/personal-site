/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,js,jsx,ts,tsx,vue,svelte}"],
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
			},
			keyframes: {
				blinkAnimation: {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0" },
				},
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
	purge: {
		enabled: process.env.NODE_ENV === "production",
		content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
		options: {
			safelist: ["animate-blink"],
		},
	},
};
