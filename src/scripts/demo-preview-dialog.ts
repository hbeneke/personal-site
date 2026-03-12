/**
 * Manages the demo preview dialog for portfolio projects.
 *
 * Uses the native `<dialog>` element with `.showModal()` for built-in focus
 * trapping, Escape-to-close, and backdrop. Populates the dialog with a project
 * title, preview image, and a link to the live demo. Also exposes
 * `openDemoDialog` as a global function on `window` so that portfolio card
 * buttons (rendered server-side) can trigger the dialog without a direct class
 * reference.
 */
export class DemoPreviewDialog {
  private dialog: HTMLDialogElement | null;
  private dialogTitle: HTMLElement | null;
  private previewImage: HTMLImageElement | null;
  private previewLink: HTMLAnchorElement | null;

  constructor() {
    this.dialog = document.getElementById("demo-preview-dialog") as HTMLDialogElement | null;
    this.dialogTitle = document.getElementById("demo-dialog-title");
    this.previewImage = document.getElementById("demo-preview-image") as HTMLImageElement;
    this.previewLink = document.getElementById("demo-preview-link") as HTMLAnchorElement;

    this.init();
  }

  private init(): void {
    this.setupEventListeners();
    this.exposeGlobalFunction();
  }

  private setupEventListeners(): void {
    const closeBtn = document.getElementById("close-demo-dialog");
    closeBtn?.addEventListener("click", () => this.closeDialog());

    // Close when clicking the backdrop (outside the dialog content).
    this.dialog?.addEventListener("click", (e) => {
      if (e.target === this.dialog) {
        this.closeDialog();
      }
    });
  }

  openDialog(title: string, demoUrl: string, imageUrl?: string): void {
    if (
      this.dialog &&
      this.dialogTitle &&
      this.previewImage &&
      this.previewLink &&
      imageUrl
    ) {
      this.dialogTitle.textContent = title;
      this.previewLink.href = demoUrl;
      this.previewImage.src = imageUrl;
      this.previewImage.alt = `${title} preview`;

      this.dialog.showModal();
    }
  }

  closeDialog(): void {
    this.dialog?.close();
  }

  // Assigns `this.openDialog` to `window.openDemoDialog` so server-rendered
  // portfolio card buttons can call it without importing this module directly.
  private exposeGlobalFunction(): void {
    type OpenDemoDialogFn = (title: string, demoUrl: string, imageUrl?: string) => void;
    (window as Window & { openDemoDialog?: OpenDemoDialogFn }).openDemoDialog =
      this.openDialog.bind(this);
  }
}

export function initDemoPreviewDialog(): DemoPreviewDialog {
  return new DemoPreviewDialog();
}

// Auto-initialize
initDemoPreviewDialog();

export default DemoPreviewDialog;
