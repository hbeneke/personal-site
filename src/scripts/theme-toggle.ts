/**
 * Custom element that manages light/dark theme switching.
 *
 * Dark is the site default: the stored `localStorage` preference wins, and OS-level
 * `prefers-color-scheme` is intentionally ignored (see the inline script in
 * base-layout.astro, which applies the same rule before first paint).
 * Registers itself as the `<theme-toggle>` custom element.
 */
export class ThemeToggle extends HTMLElement {
  private button: HTMLButtonElement | null = null;
  private html: HTMLElement = document.documentElement;
  private boundToggle = this.toggleTheme.bind(this);

  connectedCallback(): void {
    this.button = this.querySelector<HTMLButtonElement>("button");
    this.button?.addEventListener("click", this.boundToggle);
  }

  disconnectedCallback(): void {
    this.button?.removeEventListener("click", this.boundToggle);
  }

  private setThemeClass(theme: "dark" | "light"): void {
    this.html.classList.toggle("dark", theme === "dark");
  }

  getCurrentTheme(): "dark" | "light" {
    const storedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    return storedTheme || "dark";
  }

  applyTheme(theme: "dark" | "light"): void {
    this.setThemeClass(theme);
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
