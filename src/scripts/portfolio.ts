export class PortfolioPage extends HTMLElement {
  private cleanupFns: (() => void)[] = [];

  connectedCallback(): void {
    this.setupChangelogDialogs();
    this.setupSeeMoreButtons();
    this.setupSeeLessButtons();
  }

  disconnectedCallback(): void {
    for (const cleanup of this.cleanupFns) {
      cleanup();
    }
    this.cleanupFns = [];
    document.documentElement.style.overflow = "";
  }

  private addListener(element: Element, event: string, handler: EventListener): void {
    element.addEventListener(event, handler);
    this.cleanupFns.push(() => element.removeEventListener(event, handler));
  }

  private setupChangelogDialogs(): void {
    const openButtons = this.querySelectorAll(".changelog-open");

    for (const button of Array.from(openButtons)) {
      this.addListener(button, "click", () => {
        const targetId = button.getAttribute("data-target");
        if (!targetId) return;

        const dialog = document.getElementById(targetId);
        if (dialog instanceof HTMLDialogElement) {
          dialog.showModal();
          document.documentElement.style.overflow = "hidden";
          this.updateScrollFade(dialog);
        }
      });
    }

    const dialogs = this.querySelectorAll<HTMLDialogElement>(".changelog-dialog");

    for (const dialog of Array.from(dialogs)) {
      const scrollArea = dialog.querySelector(".changelog-scroll");
      if (scrollArea) {
        this.addListener(scrollArea, "scroll", () => this.updateScrollFade(dialog));
      }

      this.addListener(dialog, "close", () => {
        document.documentElement.style.overflow = "";
      });

      const closeButton = dialog.querySelector(".changelog-close");
      if (closeButton) {
        this.addListener(closeButton, "click", () => dialog.close());
      }

      this.addListener(dialog, "click", (event) => {
        if (event.target === dialog) dialog.close();
      });
    }
  }

  private updateScrollFade(dialog: HTMLDialogElement): void {
    const scrollArea = dialog.querySelector(".changelog-scroll");
    const fade = dialog.querySelector(".changelog-fade");
    if (!scrollArea || !fade) return;

    const atEnd =
      scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight <= 1;
    fade.classList.toggle("opacity-0", atEnd);
  }

  private refreshFadeFor(element: Element): void {
    const dialog = element.closest("dialog");
    if (dialog) this.updateScrollFade(dialog);
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
        this.refreshFadeFor(button);
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
        this.refreshFadeFor(button);
      });
    }
  }
}

if (!customElements.get("portfolio-page")) {
  customElements.define("portfolio-page", PortfolioPage);
}

export default PortfolioPage;
