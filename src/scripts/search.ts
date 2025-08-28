import type { PagefindUI } from "@pagefind/default-ui";

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

      // Hide tag filters by default on mobile
      this.setupMobileTagBehavior();

      this.searchInitialized = true;
      console.log("Search initialized successfully");
    } catch (error) {
      console.warn('Pagefind not available. Run "npm run build" to enable search:', error);
      this.showSearchUnavailableMessage();
    }
  }

  private setupMobileTagBehavior(): void {
    const isMobile = window.innerWidth <= 640;
    if (isMobile) {
      // Use a timeout to ensure the pagefind UI has rendered
      setTimeout(() => {
        const searchContainer = this.querySelector("#personal__search");
        if (searchContainer) {
          this.addMobileFilterHandlers(searchContainer);
          console.log("Mobile search filters collapsed by default");
        }
      }, 600);
    }
  }

  private addMobileFilterHandlers(searchContainer: Element): void {
    // Add click handlers to filter names for mobile collapse/expand
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

            // Close all other filter groups
            const allFilterGroups = searchContainer.querySelectorAll(
              ".pagefind-ui__filter-group, .pagefind-ui__filter-panel",
            );
            for (const group of Array.from(allFilterGroups)) {
              group.classList.remove("open", "active");
            }

            // Toggle current group
            if (!isOpen) {
              filterGroup.classList.add("open", "active");
            }
          }
        });
      }
    }

    // Watch for dynamic content
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

    // Listen for resize events to handle orientation changes
    window.addEventListener("resize", this.handleResize, {
      signal: this.controller.signal,
    });
  }

  private handleResize = (): void => {
    if (this.dialog?.open && this.searchInitialized) {
      // Reapply mobile tag behavior on resize
      setTimeout(() => this.setupMobileTagBehavior(), 100);
    }
  };

  disconnectedCallback(): void {
    this.controller.abort();
    if (this.pagefindUI) {
      this.pagefindUI.destroy();
      this.pagefindUI = null;
    }
  }

  private openModal = (event?: MouseEvent): void => {
    if (!this.dialog) return;

    this.dialog.showModal();

    if (!this.searchInitialized) {
      const onIdle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
      onIdle(() => this.initializeSearch());
    } else {
      // Ensure mobile tag behavior is applied when reopening
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
