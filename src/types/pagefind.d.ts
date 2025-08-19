declare module "@pagefind/default-ui" {
  interface PagefindUIOptions {
    element?: string | HTMLElement;
    baseUrl?: string;
    bundlePath?: string;
    pageSize?: number;
    resetStyles?: boolean;
    showImages?: boolean;
    showSubResults?: boolean;
    showEmptyFilters?: boolean;
    excerptLength?: number;
    debounceTimeoutMs?: number;
    mergeIndex?: Array<{
      bundlePath: string;
      baseUrl?: string;
    }>;
    translations?: Record<string, string>;
    autofocus?: boolean;
    sort?: Record<string, string>;
    processTerm?: (term: string) => string;
    processResult?: (result: PagefindSearchResult) => PagefindSearchResult;
  }

  export class PagefindUI {
    constructor(options?: PagefindUIOptions);
    destroy(): void;
    triggerSearch(term: string): void;
    clearSearch(): void;
  }
}

declare module "pagefind" {
  interface PagefindSearchOptions {
    query: string;
    filters?: Record<string, string | string[]>;
    sort?: Record<string, "asc" | "desc">;
    excerptLength?: number;
  }

  interface PagefindSearchResult {
    results: Array<{
      id: string;
      score: number;
      words: number[];
      data: () => Promise<{
        url: string;
        content: string;
        word_count: number;
        filters: Record<string, string[]>;
        meta: Record<string, string>;
        anchors: Array<{
          element: string;
          id: string;
          text: string;
          location: number;
        }>;
        weighted_locations: Array<{
          weight: number;
          balanced_score: number;
          location: number;
        }>;
        locations: number[];
        raw_content: string;
        raw_url: string;
        excerpt: string;
        sub_results: Array<{
          title: string;
          url: string;
          excerpt: string;
        }>;
      }>;
    }>;
    unfilteredResultCount: number;
    filters: Record<string, Record<string, number>>;
    totalFilters: Record<string, Record<string, number>>;
    timings: {
      preload: number;
      search: number;
      total: number;
    };
  }

  export function search(options: PagefindSearchOptions): Promise<PagefindSearchResult>;
  export function init(): Promise<void>;
  export function options(options: Record<string, unknown>): void;
  export function destroy(): void;
}
