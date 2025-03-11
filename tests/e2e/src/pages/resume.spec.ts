import { test, expect } from "@playwright/test";

test.describe("Resume Page", () => {
	test.beforeEach(async ({ page }) => {
		page.setDefaultTimeout(30000);
		await page.goto("/resume");
	});

	test("displays the correct page title", async ({ page }) => {
		const pageTitle = await page.title();
		await expect(pageTitle).toContain("Resume");
	});

	test("displays the resume header with duration", async ({ page }) => {
		const headerElement = page.locator("h2");
		const durationElement = headerElement.locator("span");
		await expect(durationElement).toHaveText(/\(.+\)/);
	});

	test("renders timeline items for work experience", async ({ page }) => {
		const timelineItems = page.locator("#time-line li");
		const itemCount = await timelineItems.count();
		expect(itemCount).toBeGreaterThan(0);
	});

	test("company links are valid", async ({ page }) => {
		const companyLinks = page.locator('a[href*="http"]');
		const numberOfLinks = await companyLinks.count();
		for (let index = 0; index < numberOfLinks; index++) {
			const link = companyLinks.nth(index);
			const href = await link.getAttribute("href");
			expect(href).toMatch(/^https?:\/\//);
		}
	});
});
