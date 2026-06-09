export class PortfolioPage extends HTMLElement {
  private cleanupFns: (() => void)[] = [];

  connectedCallback(): void {
    this.setupAccordionToggles();
    this.setupSeeMoreButtons();
    this.setupSeeLessButtons();
    this.setupDemoPreviews();
  }

  disconnectedCallback(): void {
    for (const cleanup of this.cleanupFns) {
      cleanup();
    }
    this.cleanupFns = [];
  }

  private addListener(element: Element, event: string, handler: EventListener): void {
    element.addEventListener(event, handler);
    this.cleanupFns.push(() => element.removeEventListener(event, handler));
  }

  private setupAccordionToggles(): void {
    const toggleButtons = this.querySelectorAll(".accordion-toggle");

    for (const button of Array.from(toggleButtons)) {
      this.addListener(button, "click", () => {
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

  private setupDemoPreviews(): void {
    const wrappers = this.querySelectorAll(".demo-hover-wrapper");

    for (const wrapper of Array.from(wrappers)) {
      const reposition = () => {
        const preview = wrapper.querySelector<HTMLElement>(".demo-hover-preview");
        if (!preview) return;

        const rect = wrapper.getBoundingClientRect();
        const previewHeight = preview.offsetHeight;
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUp = spaceBelow < previewHeight + 8;

        preview.classList.toggle("top-full", !openUp);
        preview.classList.toggle("mt-2", !openUp);
        preview.classList.toggle("bottom-full", openUp);
        preview.classList.toggle("mb-2", openUp);
      };

      this.addListener(wrapper, "mouseenter", reposition);
      this.addListener(wrapper, "focusin", reposition);
    }
  }

  private setupSeeMoreButtons(): void {
    const seeMoreButtons = this.querySelectorAll(".see-more-btn");

    for (const button of Array.from(seeMoreButtons)) {
      this.addListener(button, "click", () => {
        const targetId = button.getAttribute("data-target");
        if (!targetId) return;

        const extraEntries = document.querySelectorAll(
          `.changelog-extra[data-changelog-group="${targetId}"]`,
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

  private setupSeeLessButtons(): void {
    const seeLessButtons = this.querySelectorAll(".see-less-btn");

    for (const button of Array.from(seeLessButtons)) {
      this.addListener(button, "click", () => {
        const targetId = button.getAttribute("data-target");
        if (!targetId) return;

        const extraEntries = document.querySelectorAll(
          `.changelog-extra[data-changelog-group="${targetId}"]`,
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
}

if (!customElements.get("portfolio-page")) {
  customElements.define("portfolio-page", PortfolioPage);
}

export default PortfolioPage;
