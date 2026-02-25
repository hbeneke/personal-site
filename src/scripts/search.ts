import type { PagefindUI } from "@pagefind/default-ui";

/**
 * Custom element that manages the site-wide full-text search modal powered by Pagefind.
 *
 * Search initialisation is deferred until the first time the modal is opened,
 * using `requestIdleCallback` (or a `setTimeout` fallback) to avoid blocking the
 * main thread. Pagefind is not initialised in development because the search index
 * only exists after a production build.
 *
 * Global `keydown` and `resize` listeners are registered in `connectedCallback` using
 * an `AbortController` signal so they are cleanly removed when the element disconnects.
 *
 * Pagefind's filter UI does not support accordion behaviour on mobile out of the box.
 * A `MutationObserver` watches for dynamic filter elements and retrofits click handlers
 * that toggle `open`/`active` classes, implementing a single-open accordion.
 *
 * Registers itself as the `<site-search>` custom element.
 */
export class SiteSearch extends HTMLElement {
  private closeBtn: HTMLButtonElement | null;
  private dialog: HTMLDialogElement | null;
  private dialogFrame: HTMLDivElement | null;
  private openBtn: HTMLButtonElement | null;
  private controller: AbortController;
  private searchInitialized = false;
  private pagefindUI: PagefindUI | null = null;

  constructor() {
    super();
    this.openBtn = this.querySelector<HTMLButtonElement>("button[data-open-modal]");
    this.closeBtn = this.querySelector<HTMLButtonElement>("button[data-close-modal]");
    this.dialog = this.querySelector<HTMLDialogElement>("dialog");
    this.dialogFrame = this.querySelector<HTMLDivElement>(".dialog-frame");
    this.controller = new AbortController();

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (this.openBtn) {
      this.openBtn.addEventListener("click", this.openModal);
      this.openBtn.disabled = false;
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", this.closeModal);
    }

    if (this.dialog) {
      this.dialog.addEventListener("close", () => {
        window.removeEventListener("click", this.onWindowClick);
      });
    }
  }

  // Lazily initialises Pagefind on first modal open. Skipped in dev (no search index).
  private async initializeSearch(): Promise<void> {
    if (import.meta.env.DEV || this.searchInitialized) return;

    try {
      const searchContainer = this.querySelector("#personal__search");
      if (!searchContainer) return;
      const { PagefindUI } = await import("@pagefind/default-ui");

      this.pagefindUI = new PagefindUI({
        element: "#personal__search",
        baseUrl: import.meta.env.BASE_URL,
        bundlePath: `${import.meta.env.BASE_URL.replace(/\/$/, "")}/.pagefind-cache/`,
        showImages: false,
        showSubResults: true,
        showEmptyFilters: false,
        resetStyles: true,
        debounceTimeoutMs: 300,
        excerptLength: 30,
        autofocus: true,
      });

      this.setupMobileTagBehavior();

      this.searchInitialized = true;
    } catch (error) {
      this.showSearchUnavailableMessage();
    }
  }

  // Delays filter handler setup 600 ms to give Pagefind time to render filter elements.
  private setupMobileTagBehavior(): void {
    const isMobile = window.innerWidth <= 640;
    if (isMobile) {
      setTimeout(() => {
        const searchContainer = this.querySelector("#personal__search");
        if (searchContainer) {
          this.addMobileFilterHandlers(searchContainer);
        }
      }, 600);
    }
  }

  /**
   * Attaches accordion-style click handlers to Pagefind filter name elements.
   *
   * Uses a `data-mobile-click` sentinel attribute to avoid registering duplicate
   * listeners. A `MutationObserver` re-runs this method when Pagefind adds new
   * filter elements dynamically.
   */
  private addMobileFilterHandlers(searchContainer: Element): void {
    const filterNames = searchContainer.querySelectorAll(".pagefind-ui__filter-name");

    for (const filterName of Array.from(filterNames)) {
      if (!filterName.hasAttribute("data-mobile-click")) {
        filterName.setAttribute("data-mobile-click", "true");

        filterName.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          const filterGroup =
            filterName.closest(".pagefind-ui__filter-group") ||
            filterName.closest(".pagefind-ui__filter-panel");

          if (filterGroup) {
            const isOpen = filterGroup.classList.contains("open");

            const allFilterGroups = searchContainer.querySelectorAll(
              ".pagefind-ui__filter-group, .pagefind-ui__filter-panel",
            );
            for (const group of Array.from(allFilterGroups)) {
              group.classList.remove("open", "active");
            }

            if (!isOpen) {
              filterGroup.classList.add("open", "active");
            }
          }
        });
      }
    }

    const observer = new MutationObserver(() => {
      this.addMobileFilterHandlers(searchContainer);
    });

    observer.observe(searchContainer, {
      childList: true,
      subtree: true,
    });
  }

  private showSearchUnavailableMessage(): void {
    const searchContainer = this.querySelector("#personal__search");
    if (searchContainer) {
      searchContainer.innerHTML = `
        <div class="text-center p-4">
          <p class="text-gray-400 mb-2">Search not available in development</p>
          <p class="text-xs text-gray-500">Run <code class="bg-gray-700 px-1 rounded">npm run build</code> to enable search functionality</p>
        </div>
      `;
    }
  }

  connectedCallback(): void {
    window.addEventListener("keydown", this.onWindowKeydown, {
      signal: this.controller.signal,
    });

    window.addEventListener("resize", this.handleResize, {
      signal: this.controller.signal,
    });
  }

  private handleResize = (): void => {
    if (this.dialog?.open && this.searchInitialized) {
      setTimeout(() => this.setupMobileTagBehavior(), 100);
    }
  };

  // Aborts all signal-based listeners and destroys the Pagefind instance to prevent memory leaks.
  disconnectedCallback(): void {
    this.controller.abort();
    if (this.pagefindUI) {
      this.pagefindUI.destroy();
      this.pagefindUI = null;
    }
  }

  // On first open, defers Pagefind initialisation to an idle callback to avoid blocking the main thread.
  private openModal = (event?: MouseEvent): void => {
    if (!this.dialog) return;

    this.dialog.showModal();

    if (!this.searchInitialized) {
      const onIdle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
      onIdle(() => this.initializeSearch());
    } else {
      this.setupMobileTagBehavior();
    }

    setTimeout(() => {
      const searchInput = this.dialog?.querySelector("input");
      searchInput?.focus();
    }, 100);

    event?.stopPropagation();
    window.addEventListener("click", this.onWindowClick, {
      signal: this.controller.signal,
    });
  };

  private closeModal = (): void => {
    if (this.dialog) {
      this.dialog.close();
      if (this.pagefindUI) {
        this.pagefindUI.clearSearch();
      }
    }
  };

  private onWindowClick = (event: MouseEvent): void => {
    const target = event.target as Element;
    const isLink = target && "href" in target;

    if (isLink || (document.body.contains(target) && !this.dialogFrame?.contains(target))) {
      this.closeModal();
    }
  };

  // Handles Ctrl+K / Cmd+K to toggle the modal and Escape to close it.
  private onWindowKeydown = (e: KeyboardEvent): void => {
    if (!this.dialog) return;

    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      if (this.dialog.open) {
        this.closeModal();
      } else {
        this.openModal();
      }
      e.preventDefault();
    }

    if (e.key === "Escape" && this.dialog.open) {
      this.closeModal();
    }
  };
}

if (typeof window !== "undefined" && !customElements.get("site-search")) {
  customElements.define("site-search", SiteSearch);
}

export function initSiteSearch(): void {
  if (typeof window !== "undefined" && !customElements.get("site-search")) {
    customElements.define("site-search", SiteSearch);
  }
}

export default SiteSearch;
