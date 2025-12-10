import { calculatePagination, getPageRange } from "@utils/pagination";

export class ListPagination extends HTMLElement {
  private currentPage = 1;
  private itemsPerPage = 10;
  private allItems: HTMLElement[] = [];
  private filteredItems: HTMLElement[] = [];
  private paginationContainer: HTMLElement | null = null;
  private itemsContainer: HTMLElement | null = null;
  private pageInfo: HTMLElement | null = null;
  private searchInput: HTMLInputElement | null = null;
  private itemLabel = "items";
  private searchTerm = "";

  constructor() {
    super();
    this.init();
  }

  private init(): void {
    this.itemsContainer = this.querySelector("[data-pagination-items]");
    this.paginationContainer = this.querySelector("[data-pagination-controls]");
    this.pageInfo = this.querySelector("[data-page-info]");
    this.searchInput = this.querySelector("[data-pagination-search]");

    if (!this.itemsContainer || !this.paginationContainer) {
      return;
    }

    const paginationFooter = this.querySelector("[data-pagination-footer]") as HTMLElement;

    const itemsPerPageAttr = this.getAttribute("data-items-per-page");
    if (itemsPerPageAttr) {
      this.itemsPerPage = Number.parseInt(itemsPerPageAttr, 10);
    }

    const itemLabelAttr = this.getAttribute("data-item-label");
    if (itemLabelAttr) {
      this.itemLabel = itemLabelAttr;
    }

    this.allItems = Array.from(
      this.itemsContainer.querySelectorAll("[data-pagination-item]"),
    ) as HTMLElement[];

    this.filteredItems = [...this.allItems];

    if (this.allItems.length === 0) {
      this.itemsContainer.classList.remove("opacity-0");
      return;
    }

    if (this.searchInput) {
      this.setupSearch();
    }

    if (this.allItems.length <= this.itemsPerPage) {
      if (this.paginationContainer) {
        this.paginationContainer.style.display = "none";
      }
      if (paginationFooter) {
        paginationFooter.style.display = "none";
      }
      this.itemsContainer.classList.remove("opacity-0");
      this.itemsContainer.classList.add("animate-fade-in");
      return;
    }

    if (paginationFooter) {
      paginationFooter.classList.remove("opacity-0");
      paginationFooter.classList.add("animate-fade-in");
    }

    this.renderPage(1);
  }

  private renderPage(pageNumber: number): void {
    const pagination = calculatePagination({
      totalItems: this.filteredItems.length,
      itemsPerPage: this.itemsPerPage,
      currentPage: pageNumber,
    });

    this.currentPage = pagination.currentPage;

    // Hide all items first
    for (const item of this.allItems) {
      item.classList.add("hidden");
      item.classList.remove("animate-fade-in");
    }

    // Show only filtered and paginated items
    this.filteredItems.forEach((item, index) => {
      if (index >= pagination.startIndex && index < pagination.endIndex) {
        item.classList.remove("hidden");
        item.classList.add("animate-fade-in");
      }
    });

    if (this.itemsContainer?.classList.contains("opacity-0")) {
      this.itemsContainer.classList.remove("opacity-0");
      this.itemsContainer.classList.add("animate-fade-in");
    }

    this.updatePaginationControls(pagination);
    this.updatePageInfo(pagination);
    this.scrollToTop();
  }

  private setupSearch(): void {
    if (!this.searchInput) return;

    this.searchInput.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.searchTerm = target.value.toLowerCase().trim();
      this.applyFilter();
    });
  }

  private applyFilter(): void {
    const paginationFooter = this.querySelector("[data-pagination-footer]") as HTMLElement;

    if (this.searchTerm === "") {
      this.filteredItems = [...this.allItems];
    } else {
      this.filteredItems = this.allItems.filter((item) => {
        const text = item.textContent?.toLowerCase() || "";
        return text.includes(this.searchTerm);
      });
    }

    if (this.filteredItems.length <= this.itemsPerPage) {
      if (this.paginationContainer) {
        this.paginationContainer.style.display = "none";
      }
      if (paginationFooter) {
        paginationFooter.style.display = "none";
      }
    } else {
      if (this.paginationContainer) {
        this.paginationContainer.style.display = "flex";
      }
      if (paginationFooter) {
        paginationFooter.style.display = "block";
      }
    }

    // Reset to first page and render
    this.renderPage(1);
  }

  private updatePaginationControls(pagination: ReturnType<typeof calculatePagination>): void {
    if (!this.paginationContainer) return;

    const pageRange = getPageRange(pagination.currentPage, pagination.totalPages);

    // Update prev/next buttons
    const prevBtn = this.querySelector<HTMLButtonElement>("[data-page-btn='prev']");
    const nextBtn = this.querySelector<HTMLButtonElement>("[data-page-btn='next']");

    if (prevBtn) {
      prevBtn.disabled = !pagination.hasPrevPage;
    }

    if (nextBtn) {
      nextBtn.disabled = !pagination.hasNextPage;
    }

    // Update page numbers
    const pageNumbersContainer = this.querySelector("[data-page-numbers]");
    if (!pageNumbersContainer) return;

    const pageButtons: HTMLElement[] = [];

    for (const page of pageRange) {
      if (page === null) {
        const ellipsis = document.createElement("span");
        ellipsis.className = "px-3 py-2 text-gray-500";
        ellipsis.textContent = "...";
        pageButtons.push(ellipsis);
      } else {
        const isActive = page === pagination.currentPage;
        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("data-page-num", page.toString());
        button.className = `px-3 py-2 text-sm rounded-md transition-colors ${
          isActive
            ? "bg-yellow-400 text-gray-900 font-medium"
            : "hover:bg-gray-700 text-gray-300 hover:text-gray-100"
        }`;
        if (isActive) {
          button.setAttribute("aria-current", "page");
        }
        button.setAttribute("aria-label", `Page ${page}`);
        button.textContent = page.toString();
        pageButtons.push(button);
      }
    }

    pageNumbersContainer.replaceChildren(...pageButtons);

    // Setup event listeners once
    if (!this.hasAttribute("data-listeners-attached")) {
      this.setupPaginationListeners();
      this.setAttribute("data-listeners-attached", "true");
    }
  }

  private setupPaginationListeners(): void {
    const prevBtn = this.querySelector<HTMLButtonElement>("[data-page-btn='prev']");
    const nextBtn = this.querySelector<HTMLButtonElement>("[data-page-btn='next']");
    const pageNumbersContainer = this.querySelector("[data-page-numbers]");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (!prevBtn.disabled) {
          this.renderPage(this.currentPage - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (!nextBtn.disabled) {
          this.renderPage(this.currentPage + 1);
        }
      });
    }

    if (pageNumbersContainer) {
      pageNumbersContainer.addEventListener("click", (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.tagName === "BUTTON" && target.hasAttribute("data-page-num")) {
          const pageNum = target.getAttribute("data-page-num");
          if (pageNum) {
            this.renderPage(Number.parseInt(pageNum, 10));
          }
        }
      });
    }
  }

  private updatePageInfo(pagination: ReturnType<typeof calculatePagination>): void {
    if (!this.pageInfo) return;

    const start = pagination.startIndex + 1;
    const end = pagination.endIndex;
    const total = this.filteredItems.length;

    if (this.searchTerm && total < this.allItems.length) {
      this.pageInfo.textContent = `Showing ${start}-${end} of ${total} ${this.itemLabel} (filtered from ${this.allItems.length})`;
    } else {
      this.pageInfo.textContent = `Showing ${start}-${end} of ${total} ${this.itemLabel}`;
    }
  }

  private scrollToTop(): void {
    const headerOffset = 100;
    const elementPosition = this.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}

if (!customElements.get("list-pagination")) {
  customElements.define("list-pagination", ListPagination);
}

export function initListPagination(): void {
  if (!customElements.get("list-pagination")) {
    customElements.define("list-pagination", ListPagination);
  }
}

export default ListPagination;
