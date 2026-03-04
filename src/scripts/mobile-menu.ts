/**
 * Custom element that manages the mobile navigation menu.
 *
 * Handles open/close toggling, outside-click dismissal, keyboard navigation
 * (Escape to close), auto-close on link click, and repositioning below the
 * site header on resize. Registers itself as the `<mobile-menu>` custom element.
 */
export class MobileMenu extends HTMLElement {
  private button: HTMLButtonElement | null;
  private menu: HTMLElement | null;
  private isOpen = false;

  private handleDocumentClick = (e: MouseEvent) => {
    if (
      this.isOpen &&
      !this.menu?.contains(e.target as Node) &&
      !this.button?.contains(e.target as Node)
    ) {
      this.close();
    }
  };

  private handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this.isOpen) {
      this.close();
    }
  };

  private handleResize = () => {
    if (window.innerWidth >= 640 && this.isOpen) {
      this.close();
    }
    this.setMenuPosition();
  };

  constructor() {
    super();
    this.button = this.querySelector<HTMLButtonElement>("button");
    this.menu = this.querySelector<HTMLElement>("nav");
    this.init();
  }

  private init(): void {
    if (!this.button || !this.menu) {
      return;
    }

    this.setupEventListeners();
    this.setMenuPosition();
  }

  // Reads the current height of `#main-header` and sets the menu `top` and `--header-height` CSS variable.
  private setMenuPosition(): void {
    const header = document.getElementById("main-header");
    if (header && this.menu) {
      const headerHeight = header.offsetHeight;
      this.menu.style.setProperty("--header-height", `${headerHeight}px`);
      this.menu.style.top = `${headerHeight}px`;
    }
  }

  private setupEventListeners(): void {
    this.button?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggle();
    });

    document.addEventListener("click", this.handleDocumentClick);
    document.addEventListener("keydown", this.handleKeydown);

    const menuLinks = this.menu?.querySelectorAll("a");
    if (menuLinks) {
      for (const link of Array.from(menuLinks)) {
        link.addEventListener("click", () => {
          this.close();
        });
      }
    }

    window.addEventListener("resize", this.handleResize);
  }

  disconnectedCallback(): void {
    document.removeEventListener("click", this.handleDocumentClick);
    document.removeEventListener("keydown", this.handleKeydown);
    window.removeEventListener("resize", this.handleResize);
  }

  private toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  private open(): void {
    if (!this.menu || !this.button) return;

    this.isOpen = true;
    this.button.setAttribute("aria-expanded", "true");
    this.menu.classList.remove("opacity-0", "invisible");
    this.menu.classList.add("opacity-100", "visible");
    document.body.style.overflow = "hidden";
  }

  private close(): void {
    if (!this.menu || !this.button) return;

    this.isOpen = false;
    this.button.setAttribute("aria-expanded", "false");
    this.menu.classList.remove("opacity-100", "visible");
    this.menu.classList.add("opacity-0", "invisible");
    document.body.style.overflow = "";
  }
}

if (!customElements.get("mobile-menu")) {
  customElements.define("mobile-menu", MobileMenu);
}

export default MobileMenu;
