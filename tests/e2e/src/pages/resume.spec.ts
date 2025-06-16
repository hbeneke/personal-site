import { test, expect } from "@playwright/test";

test.describe("Resume Page", () => {
	test.beforeEach(async ({ page }) => {
		page.setDefaultTimeout(30000);
		await page.goto("/resume");
	});

	test("displays the correct page title", async ({ page }) => {
		const pageTitle = await page.title();
		expect(pageTitle).toContain("Resume");
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

	test("displays work experiences in chronological order (newest first)", async ({ page }) => {
		const timeElements = page.locator("#time-line li time");
		const count = await timeElements.count();

		if (count > 1) {
			const dates = [];
			for (let i = 0; i < count; i++) {
				const timeText = await timeElements.nth(i).textContent();
				if (timeText) {
					// Extract start date from "start_date – end_date (duration)" format
					const startDate = timeText.split(" – ")[0];
					dates.push(new Date(startDate).getTime());
				}
			}

			// Check that dates are in descending order (newest first)
			for (let i = 1; i < dates.length; i++) {
				if (!Number.isNaN(dates[i - 1]) && !Number.isNaN(dates[i])) {
					expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
				}
			}
		}
	});

	test("company links are valid and open in new tab", async ({ page }) => {
		const companyLinks = page.locator('a[href*="http"]');
		const numberOfLinks = await companyLinks.count();

		for (let index = 0; index < numberOfLinks; index++) {
			const link = companyLinks.nth(index);
			const href = await link.getAttribute("href");
			const target = await link.getAttribute("target");
			const rel = await link.getAttribute("rel");

			expect(href).toMatch(/^https?:\/\//);
			expect(target).toBe("_blank");
			expect(rel).toBe("noopener noreferrer");
		}
	});

	test("displays company names and positions correctly", async ({ page }) => {
		const jobTitles = page.locator("#time-line h3.secondary");
		const count = await jobTitles.count();

		expect(count).toBeGreaterThan(0);

		for (let i = 0; i < count; i++) {
			const titleText = await jobTitles.nth(i).textContent();
			expect(titleText).toContain("at");
			expect(titleText).toContain("@");
		}
	});

	test("displays locations for work experiences", async ({ page }) => {
		const locations = page.locator("#time-line p.text-yellow-500");
		const count = await locations.count();

		expect(count).toBeGreaterThan(0);

		for (let i = 0; i < count; i++) {
			const locationText = await locations.nth(i).textContent();
			expect(locationText).toBeTruthy();
		}
	});

	test("displays descriptions and responsibilities", async ({ page }) => {
		const descriptions = page.locator("#time-line p.text-white");
		const responsibilityLists = page.locator("#time-line ul.list-disc");

		const descCount = await descriptions.count();
		const respCount = await responsibilityLists.count();

		expect(descCount).toBeGreaterThan(0);
		expect(respCount).toBeGreaterThan(0);

		// Check that each responsibility list has items
		for (let i = 0; i < respCount; i++) {
			const listItems = responsibilityLists.nth(i).locator("li");
			const itemCount = await listItems.count();
			expect(itemCount).toBeGreaterThan(0);
		}
	});

	test("timeline visual elements are present", async ({ page }) => {
		const timelineBorder = page.locator("ol.border-s.border-green-500");
		const timelineDots = page.locator("div.bg-green-500.rounded-full");

		await expect(timelineBorder).toBeVisible();

		const dotCount = await timelineDots.count();
		expect(dotCount).toBeGreaterThan(0);
	});
});
