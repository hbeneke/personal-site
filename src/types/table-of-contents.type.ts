export interface TableOfContent {
  depth: number;
  text: string;
  slug: string;
}

export interface Props {
  headings: TableOfContent[];
}
