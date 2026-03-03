/**
 * Custom element that manages light/dark theme switching.
 *
 * Reads the user's stored preference from `localStorage` on initialisation,
 * falls back to the OS-level `prefers-color-scheme` media query, and keeps the
 * two in sync when the system preference changes (only when no manual override exists).
 * Registers itself as the `<theme-toggle>` custom element.
 */
export class ThemeToggle extends HTMLElement {
  private button: HTMLButtonElement | null;
  private html: HTMLElement;

  constructor() {
    super();
    this.button = this.querySelector<HTMLButtonElement>("button");
    this.html = document.documentElement;
    this.init();
  }

  private init(): void {
    if (!this.button) {
      return;
    }

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.button?.addEventListener("click", this.toggleTheme.bind(this));

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        this.applyTheme(e.matches ? "dark" : "light");
      }
    });
  }

  getSystemPreference(): "dark" | "light" {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  getCurrentTheme(): "dark" | "light" {
    const storedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    return storedTheme || this.getSystemPreference();
  }

  applyTheme(theme: "dark" | "light"): void {
    if (theme === "dark") {
      this.html.classList.add("dark");
    } else {
      this.html.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }

  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    this.applyTheme(newTheme);
  }
}

if (!customElements.get("theme-toggle")) {
  customElements.define("theme-toggle", ThemeToggle);
}

export default ThemeToggle;
