/**
 * Handles CV download by opening `/resume/print` in a popup and triggering the browser's print dialog.
 *
 * Flow: open popup → wait for `load` event → call `print()` after 500 ms.
 * A polling interval restores button state when the popup is closed, and a 5-second
 * safety timeout does the same in case the `load` event never fires.
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

  async downloadCV(): Promise<void> {
    const button = this.getButton();
    if (!button) return;

    try {
      this.setLoadingState(true);

      const printUrl = `${window.location.origin}/resume/print?t=${Date.now()}`;

      const printWindow = window.open(printUrl, "_blank", "width=800,height=600");

      if (!printWindow) {
        throw new Error("Popup blocked. Please allow popups for this site.");
      }

      printWindow.addEventListener("load", () => {
        setTimeout(() => {
          printWindow.print();
          this.setLoadingState(false);
        }, 500);
      });

      const checkClosed = setInterval(() => {
        if (printWindow.closed) {
          clearInterval(checkClosed);
          this.setLoadingState(false);
        }
      }, 1000);

      setTimeout(() => {
        this.setLoadingState(false);
        clearInterval(checkClosed);
      }, 5000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      if (import.meta.env.DEV) {
        console.error("CV Download error:", message);
      }
      alert("Failed to download CV. Please try again or check if popups are blocked.");
      this.setLoadingState(false);
    }
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
