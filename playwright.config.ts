import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	workers: 5,
	retries: 2,
	reporter: "html",
	use: {
		trace: "retain-on-failure",
		baseURL: "http://localhost:4321",
	},

	webServer: {
		command: "npm run start",
		url: "http://localhost:4321",
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},

		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},

		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
	],
});
