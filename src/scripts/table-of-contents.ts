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

    this.setupEventListeners();
    this.updateTOC();
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

  private updateTOC(): void {
    let current = "";
    let closestHeading = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const heading of Array.from(this.headings)) {
      const rect = heading.getBoundingClientRect();
      const distance = Math.abs(rect.top - 120);

      if (rect.top <= 120 && distance < closestDistance) {
        closestDistance = distance;
        closestHeading = heading;
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
      link.removeAttribute("data-active");

      if (link.getAttribute("href") === `#${current}`) {
        link.setAttribute("data-active", "true");
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

customElements.define("table-of-contents", TableOfContents);
