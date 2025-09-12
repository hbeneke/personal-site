export class NoteAnnouncement extends HTMLElement {
  private announcement: HTMLElement | null;
  private closeButton: HTMLButtonElement | null;
  private readonly storageKey = "note-announcement-closed";

  constructor() {
    super();
    this.announcement = document.getElementById("note-announcement");
    this.closeButton = document.getElementById("close-note-announcement") as HTMLButtonElement;
    this.init();
  }

  private init(): void {
    if (!this.announcement || !this.closeButton) {
      return;
    }

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.closeButton?.addEventListener("click", this.handleClose.bind(this));
  }

  private handleClose(): void {
    if (!this.announcement) return;

    const noteSlug = this.announcement.getAttribute("data-note-slug");

    this.announcement.style.transform = "translateX(100%)";
    this.announcement.style.opacity = "0";

    setTimeout(() => {
      if (this.announcement && noteSlug) {
        this.announcement.style.display = "none";
        localStorage.setItem(this.storageKey, noteSlug);
      }
    }, 300);
  }
}

customElements.define("note-announcement", NoteAnnouncement);
