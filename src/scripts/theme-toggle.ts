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

  private getSystemPreference(): "dark" | "light" {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  private getCurrentTheme(): "dark" | "light" {
    const storedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    return storedTheme || this.getSystemPreference();
  }

  private applyTheme(theme: "dark" | "light"): void {
    if (theme === "dark") {
      this.html.classList.add("dark");
    } else {
      this.html.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }

  private toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    this.applyTheme(newTheme);
  }

  public getCurrentThemeForTesting(): "dark" | "light" {
    return this.getCurrentTheme();
  }

  public setThemeForTesting(theme: "dark" | "light"): void {
    this.applyTheme(theme);
  }
}

if (!customElements.get("theme-toggle")) {
  customElements.define("theme-toggle", ThemeToggle);
}
