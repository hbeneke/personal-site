export class MobileMenu extends HTMLElement {
  private button: HTMLButtonElement | null;
  private menu: HTMLElement | null;
  private isOpen = false;

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

    document.addEventListener("click", (e) => {
      if (
        this.isOpen &&
        !this.menu?.contains(e.target as Node) &&
        !this.button?.contains(e.target as Node)
      ) {
        this.close();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });

    const menuLinks = this.menu?.querySelectorAll("a");
    if (menuLinks) {
      for (const link of Array.from(menuLinks)) {
        link.addEventListener("click", () => {
          this.close();
        });
      }
    }

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 640 && this.isOpen) {
        this.close();
      }
      this.setMenuPosition();
    });
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

export function initMobileMenu(): void {
  if (!customElements.get("mobile-menu")) {
    customElements.define("mobile-menu", MobileMenu);
  }
}

export function autoInit(): void {
  initMobileMenu();
}

// Auto-initialize
autoInit();

// Default export for backwards compatibility
export default autoInit;
