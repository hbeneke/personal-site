import { test, expect } from "@playwright/test";

test.describe("404 Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/404");
  });

  test("displays the correct page title", async ({ page }) => {
    const pageTitle = await page.title();
    await expect(pageTitle).toContain("404 Error");
  });

  test("shows the main header with error message", async ({ page }) => {
    const headerElement = page.locator("h1.title");
    await expect(headerElement).toBeVisible();
    await expect(headerElement).toContainText("404");
    await expect(headerElement).toContainText("Arrr! Page be lost at sea!");
  });

  test("shows the error description paragraphs", async ({ page }) => {
    // Select only the paragraphs following the header
    const descriptionParagraphs = page.locator("h1.title ~ p");
    await expect(descriptionParagraphs.nth(0)).toContainText(
      "Ye must’ve sailed off the edge of the map"
    );
    await expect(descriptionParagraphs.nth(1)).toContainText(
      "Return to the home port"
    );
  });

  test("navigates to home when clicking the home link", async ({ page }) => {
    const homeLinkElement = page.getByRole("link", {
      name: "Return to the home port",
    });
    await expect(homeLinkElement).toBeVisible();
    await homeLinkElement.click();
    await expect(page).toHaveURL("/");
  });

  test("has the correct meta description", async ({ page }) => {
    const metaDescription = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(metaDescription).toBe(
      "Arrr! Ye be lost, matey! This page be buried treasure that no one can find."
    );
  });
});
