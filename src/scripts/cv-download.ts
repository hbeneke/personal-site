/**
 * Handles CV download by opening `/resume/print?print=true` in a popup window.
 *
 * The print page triggers its own print dialog on load (see print-layout.astro),
 * so this class only manages the button state: a polling interval restores it
 * when the popup is closed, with a 5-second safety timeout as fallback.
 *
 * Note: an embedded iframe is not an option here because the site ships
 * `X-Frame-Options: DENY`, which blocks same-origin framing too.
 */
class CVDownloader {
  private readonly buttonId = "cv-download-btn";
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private clickHandler: ((e: Event) => void) | null = null;

  constructor() {
    this.init();
  }

  init(): void {
    this.bindEvents();
  }

  private getButton(): HTMLButtonElement | null {
    return document.getElementById(this.buttonId) as HTMLButtonElement | null;
  }

  bindEvents(): void {
    const downloadButton = this.getButton();
    if (!downloadButton) {
      if (import.meta.env.DEV) {
        console.warn(`CV Download: Button with id "${this.buttonId}" not found`);
      }
      return;
    }

    this.clickHandler = (e: Event) => {
      e.preventDefault();
      this.downloadCV();
    };

    this.keydownHandler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        this.downloadCV();
      }
    };

    downloadButton.addEventListener("click", this.clickHandler);
    document.addEventListener("keydown", this.keydownHandler);
  }

  destroy(): void {
    if (this.keydownHandler) {
      document.removeEventListener("keydown", this.keydownHandler);
      this.keydownHandler = null;
    }

    if (this.clickHandler) {
      const button = this.getButton();
      button?.removeEventListener("click", this.clickHandler);
      this.clickHandler = null;
    }
  }

  downloadCV(): void {
    const button = this.getButton();
    if (!button) return;

    this.setLoadingState(true);

    const printUrl = `${window.location.origin}/resume/print?print=true`;
    const popup = window.open(printUrl, "_blank");

    if (!popup) {
      // Popup blocked: navigate to the print page, it opens the dialog itself
      window.location.href = printUrl;
      this.setLoadingState(false);
      return;
    }

    const watcher = window.setInterval(() => {
      if (popup.closed) {
        window.clearInterval(watcher);
        this.setLoadingState(false);
      }
    }, 500);

    // Safety net in case the user keeps the popup open
    window.setTimeout(() => {
      window.clearInterval(watcher);
      this.setLoadingState(false);
    }, 5000);
  }

  setLoadingState(loading: boolean): void {
    const button = this.getButton();
    if (!button) return;

    const downloadText = button.querySelector(".download-text");
    const loadingText = button.querySelector(".loading-text");
    const downloadIcon = button.querySelector(".download-icon");

    if (loading) {
      button.disabled = true;
      button.classList.remove("hover:text-green-400", "hover:underline");
      downloadText?.classList.add("hidden");
      downloadIcon?.classList.add("hidden");
      loadingText?.classList.remove("hidden");
    } else {
      button.disabled = false;
      button.classList.add("hover:text-green-400", "hover:underline");
      downloadText?.classList.remove("hidden");
      downloadIcon?.classList.remove("hidden");
      loadingText?.classList.add("hidden");
    }
  }
}

export { CVDownloader };
export default CVDownloader;
