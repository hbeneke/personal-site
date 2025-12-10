export function setupAccordionToggles(): void {
  const toggleButtons = document.querySelectorAll(".accordion-toggle");

  for (const button of Array.from(toggleButtons)) {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      if (!targetId) return;

      const content = document.getElementById(targetId);
      const icon = button.querySelector(".accordion-icon");
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      if (content) {
        if (isExpanded) {
          content.classList.add("hidden");
          button.setAttribute("aria-expanded", "false");
          icon?.classList.remove("rotate-180");
        } else {
          content.classList.remove("hidden");
          button.setAttribute("aria-expanded", "true");
          icon?.classList.add("rotate-180");
        }
      }
    });
  }
}

export function setupSeeMoreButtons(): void {
  const seeMoreButtons = document.querySelectorAll(".see-more-btn");

  for (const button of Array.from(seeMoreButtons)) {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      if (!targetId) return;

      const extraEntries = document.querySelectorAll(
        `.changelog-extra[data-changelog-group="${targetId}"]`
      );
      const seeLessBtn = button.parentElement?.querySelector(".see-less-btn");

      for (const entry of Array.from(extraEntries)) {
        entry.classList.remove("hidden");
      }

      button.classList.add("hidden");
      seeLessBtn?.classList.remove("hidden");
    });
  }
}

export function setupSeeLessButtons(): void {
  const seeLessButtons = document.querySelectorAll(".see-less-btn");

  for (const button of Array.from(seeLessButtons)) {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      if (!targetId) return;

      const extraEntries = document.querySelectorAll(
        `.changelog-extra[data-changelog-group="${targetId}"]`
      );
      const seeMoreBtn = button.parentElement?.querySelector(".see-more-btn");

      for (const entry of Array.from(extraEntries)) {
        entry.classList.add("hidden");
      }

      button.classList.add("hidden");
      seeMoreBtn?.classList.remove("hidden");
    });
  }
}

export function setupDemoButtons(): void {
  const demoButtons = document.querySelectorAll(".demo-preview-btn");

  for (const button of Array.from(demoButtons)) {
    button.addEventListener("click", () => {
      const demoUrl = button.getAttribute("data-demo-url");
      const demoImage = button.getAttribute("data-demo-image");
      const projectTitle = button.getAttribute("data-project-title");

      if (demoUrl && projectTitle) {
        // Use the global function exposed by the component
        const openDialog = (
          window as typeof window & {
            openDemoDialog?: (title: string, url: string, image?: string) => void;
          }
        ).openDemoDialog;
        if (openDialog) {
          openDialog(projectTitle, demoUrl, demoImage || undefined);
        }
      }
    });
  }
}

export function initPortfolio(): void {
  setupAccordionToggles();
  setupSeeMoreButtons();
  setupSeeLessButtons();
  setupDemoButtons();
}

document.addEventListener("DOMContentLoaded", () => {
  initPortfolio();
});
