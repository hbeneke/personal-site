export class TableOfContents extends HTMLElement {
  private tocLinks: NodeListOf<HTMLAnchorElement>;
  private headings: NodeListOf<HTMLHeadingElement>;
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

  private handleLinkClick(): void {
    const details = this.closest("details");
    if (details && window.innerWidth < 1024) {
      setTimeout(() => {
        details.removeAttribute("open");
      }, 300);
    }
  }

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
