/**
 * Custom element that implements an auto-highlighting table of contents.
 *
 * Tracks the user's scroll position and highlights the TOC link that corresponds
 * to the heading currently closest to the top of the viewport. Uses
 * `requestAnimationFrame` throttling to keep scroll handling performant.
 * Registers itself as the `<table-of-contents>` custom element.
 */
export class TableOfContents extends HTMLElement {
  private tocLinks: NodeListOf<HTMLAnchorElement>;
  private headings: NodeListOf<HTMLHeadingElement>;
  /** Flag used to throttle scroll events via `requestAnimationFrame`. */
  private ticking = false;

  constructor() {
    super();
    this.tocLinks = this.querySelectorAll("a") as NodeListOf<HTMLAnchorElement>;
    this.headings = document.querySelectorAll(
      "h1, h2, h3, h4, h5, h6",
    ) as NodeListOf<HTMLHeadingElement>;
    this.init();
  }

  private init(): void {
    if (!this.tocLinks.length || !this.headings.length) {
      return;
    }

    this.applyTransitionStyles();
    this.setupEventListeners();
    this.updateTOC();
  }

  private applyTransitionStyles(): void {
    for (const link of Array.from(this.tocLinks)) {
      link.style.transition = "all 0.3s ease";
    }
  }

  private setupEventListeners(): void {
    for (const link of Array.from(this.tocLinks)) {
      link.addEventListener("click", this.handleLinkClick.bind(this));
    }

    window.addEventListener("scroll", this.scrollHandler.bind(this));
  }

  // On mobile (viewport < 1024 px), collapses the parent `<details>` 300 ms after a link click
  // to allow the scroll animation to complete before the TOC closes.
  private handleLinkClick(): void {
    const details = this.closest("details");
    if (details && window.innerWidth < 1024) {
      setTimeout(() => {
        details.removeAttribute("open");
      }, 300);
    }
  }

  /**
   * Determines the currently "active" heading and updates TOC link styles accordingly.
   *
   * Two-pass algorithm:
   * 1. Find the last heading whose top edge is at or above the 120 px threshold (closest to it).
   * 2. If no heading has crossed the threshold (page top), fall back to the first heading with a positive `top`.
   */
  updateTOC(): void {
    let current = "";
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const heading of Array.from(this.headings)) {
      const rect = heading.getBoundingClientRect();
      const distance = Math.abs(rect.top - 120);

      if (rect.top <= 120 && distance < closestDistance) {
        closestDistance = distance;
        current = heading.id;
      }
    }

    if (!current) {
      for (const heading of Array.from(this.headings)) {
        const rect = heading.getBoundingClientRect();
        if (rect.top > 0 && !current) {
          current = heading.id;
        }
      }
    }

    for (const link of Array.from(this.tocLinks)) {
      link.classList.remove("active");
      link.style.backgroundColor = "";
      link.style.transform = "";

      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
        link.style.backgroundColor = "rgba(var(--primary), 0.08)";
        link.style.transform = "translateX(2px)";
      }
    }
  }

  // Throttles scroll events with `requestAnimationFrame` to avoid redundant updates.
  private scrollHandler(): void {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateTOC();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }
}

export function initTableOfContents(): void {
  if (!customElements.get("table-of-contents")) {
    customElements.define("table-of-contents", TableOfContents);
  }
}

// Auto-initialize
initTableOfContents();

export default TableOfContents;
