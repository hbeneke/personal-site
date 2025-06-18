import { test, expect } from "@playwright/test";

test.describe("Notes Page", () => {
  test.beforeEach(async ({ page }) => {
    page.setDefaultTimeout(30000);
    await page.goto("/notes");
  });

  test("displays the correct page title", async ({ page }) => {
    const pageTitle = await page.title();
    expect(pageTitle).toContain("Notes");
  });

  test("notes are ordered by date with most recent first", async ({ page }) => {
    const noteDates = page.locator(".notes-list article time");
    const count = await noteDates.count();

    expect(count).toBeGreaterThan(0);

    const dates = [];
    for (let i = 0; i < count; i++) {
      const dateString = await noteDates.nth(i).getAttribute("datetime");
      if (dateString) {
        dates.push(new Date(dateString).getTime());
      }
    }

    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
    }
  });

  test("notes are grouped by year", async ({ page }) => {
    const yearHeadings = page.locator(".notes-list h3.font-bold");
    const count = await yearHeadings.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const year = await yearHeadings.nth(i).textContent();

      const notesInYearGroup = yearHeadings
        .nth(i)
        .locator("~ a article")
        .filter({
          has: page.locator("time"),
        });

      const notesCount = await notesInYearGroup.count();
      expect(notesCount).toBeGreaterThan(0);

      for (let j = 0; j < notesCount; j++) {
        const dateTime = await notesInYearGroup.nth(j).locator("time").getAttribute("datetime");
        if (dateTime) {
          const noteYear = new Date(dateTime).getFullYear().toString();
          expect(noteYear).toBe(year);
        }
      }
    }
  });

  test("clicking on a note navigates to the correct note page with slug", async ({ page }) => {
    const firstNote = page.locator(".notes-list article").first();

    await expect(firstNote).toBeVisible();

    const noteTitle = await firstNote.locator("h3.title").textContent();
    const parentLink = firstNote.locator("xpath=./..");
    const href = await parentLink.getAttribute("href");

    expect(href).toMatch(/^\/notes\/[\w-]+$/);

    const slug = href?.split("/").pop();

    await parentLink.click();

    await expect(page).toHaveURL(`/notes/${slug}`);

    const detailTitle = page.locator("h3.note-title");
    await expect(detailTitle).toBeVisible();
    await expect(detailTitle).toContainText(noteTitle || "");

    const backButton = page.getByText("Back to Notes");
    await expect(backButton).toBeVisible();
  });
});
