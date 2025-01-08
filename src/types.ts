export interface MenuLink {
  path: string;
  title: string;
}

export interface SiteConfig {
  author: string;
  nickName: string;
  date: {
    locale: string | string[] | undefined;
    options: Intl.DateTimeFormatOptions;
  };
  description: string;
  title: string;
}
