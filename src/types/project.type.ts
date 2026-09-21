export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export interface Project {
  title: string;
  date: string;
  description: string;
  technologies: string[];
  link?: string;
  logo?: string;
  github?: string;
  privateCode?: boolean;
  status?: "wip" | "archived";
  demo?: string;
  featured: boolean;
  order?: number;
  version?: string;
  changelog?: ChangelogEntry[];
  license?: string;
  licenseUrl?: string;
}
