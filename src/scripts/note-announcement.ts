export class NoteAnnouncement extends HTMLElement {
  private announcement: HTMLElement | null;
  private closeButton: HTMLButtonElement | null;
  private readMoreLink: HTMLAnchorElement | null;
  private readonly storageKey = "note-announcement-closed";

  constructor() {
    super();
    this.announcement = document.getElementById("note-announcement");
    this.closeButton = document.getElementById("close-note-announcement") as HTMLButtonElement;
    this.readMoreLink = document.getElementById("read-more-link") as HTMLAnchorElement;
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
    this.readMoreLink?.addEventListener("click", this.handleReadMoreClick.bind(this));
  }

  private handleReadMoreClick(event: Event): void {
    event.preventDefault();

    const target = event.target as HTMLAnchorElement;
    const href = target.href;

    this.handleClose();

    setTimeout(() => {
      window.location.href = href;
    }, 300);
  }

  handleClose(): void {
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

export function initNoteAnnouncement(): void {
  if (!customElements.get("note-announcement")) {
    customElements.define("note-announcement", NoteAnnouncement);
  }
}

// Auto-initialize
initNoteAnnouncement();

export default NoteAnnouncement;
