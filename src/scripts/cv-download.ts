class CVDownloader {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const downloadButton = document.getElementById("cv-download-btn");
    if (!downloadButton) return;

    downloadButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.downloadCV();
    });

    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        this.downloadCV();
      }
    });
  }

  async downloadCV() {
    const button = document.getElementById("cv-download-btn");
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
      alert("Failed to download CV. Please try again or check if popups are blocked.");
      this.setLoadingState(false);
    }
  }

  setLoadingState(loading: boolean): void {
    const button = document.getElementById("cv-download-btn") as HTMLButtonElement;
    const downloadText = button?.querySelector(".download-text");
    const loadingText = button?.querySelector(".loading-text");
    const downloadIcon = button?.querySelector(".download-icon");

    if (!button) return;

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

export default CVDownloader;
