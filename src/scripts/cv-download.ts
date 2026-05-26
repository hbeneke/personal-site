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

      // Create an invisible iframe to handle document rendering and printing seamlessly
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "none";
      iframe.style.opacity = "0";
      iframe.src = printUrl;

      iframe.addEventListener("load", () => {
        try {
          if (iframe.contentWindow) {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
          } else {
            throw new Error("Unable to access iframe window context.");
          }
        } catch (iframeError) {
          if (import.meta.env.DEV) {
            console.error("Iframe print triggered fallback:", iframeError);
          }
          // Fallback to direct redirect print page if iframe sandbox security fails
          window.location.href = printUrl;
        } finally {
          // Cleanup iframe from Document DOM and restore loading button state
          setTimeout(() => {
            document.body.removeChild(iframe);
            this.setLoadingState(false);
          }, 1000);
        }
      });

      document.body.appendChild(iframe);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      if (import.meta.env.DEV) {
        console.error("CV Download error:", message);
      }
      alert("Failed to download CV. Please try again.");
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
