import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";

export default defineConfig({
	integrations: [
		tailwind({
			config: {
				content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
			},
		}),
	],
	adapter: vercel(),
	build: {
		inlineStylesheets: "auto",
		assets: "assets",
	},
	prefetch: {
		prefetchAll: true,
		defaultStrategy: "viewport",
	},
	vite: {
		build: {
			rollupOptions: {
				output: {
					manualChunks: {
						vendor: ["astro"],
						utils: ["./src/utils/date", "./src/utils/post", "./src/utils/note"],
					},
				},
			},
			cssCodeSplit: false,
		},
		resolve: {
			alias: {
				"@": "/src",
				"@types": "/src/types/index.ts",
			},
		},
	},
	image: {
		remotePatterns: [{ protocol: "https" }],
		service: {
			entrypoint: "astro/assets/services/sharp",
		},
	},
});
