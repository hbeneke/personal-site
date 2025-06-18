import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    page.setDefaultTimeout(30000);
    await page.goto("/");
  });

  test("displays the correct page title", async ({ page }) => {
    const title = await page.title();
    expect(title).toContain("Home");
  });

  test("shows the main header with greeting text", async ({ page }) => {
    const header = page.locator("h1.font-semibold");
    await expect(header).toBeVisible();
    await expect(header).toContainText("Hey There");
  });

  test("displays description with job title and motto", async ({ page }) => {
    const description = page.locator("section p.mb-4").first();
    await expect(description).toBeVisible();
    await expect(description).toContainText("Frontend Developer");
    await expect(description).toContainText("Never stop learning");
  });

  test("renders contact info with email and social links", async ({ page }) => {
    const linkedinLink = page.getByRole("link", { name: "Linkedin Profile" });
    await expect(linkedinLink).toBeVisible();
    const githubLink = page.getByRole("link", { name: "GitHub Profile" });
    await expect(githubLink).toBeVisible();
    const xProfileLink = page.getByRole("link", { name: "X Profile" });
    await expect(xProfileLink).toBeVisible();
  });

  test("displays nickname", async ({ page }) => {
    const nicknameText = page.locator('p:has-text("In some places, I am also known as")');
    await expect(nicknameText).toBeVisible();
  });

  test("has the correct meta description", async ({ page }) => {
    const metaDescription = await page.locator('meta[name="description"]').getAttribute("content");
    expect(metaDescription).toMatch(
      /Welcome to my personal webpage and blog! I'm a senior .* in modern web technologies\. Explore my thoughts, projects, and experiences in software development\./,
    );
  });
});
