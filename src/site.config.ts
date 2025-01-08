import type { MenuLink, SiteConfig } from "@/types";

export const menuLinks: MenuLink[] = [
  {
    path: "/",
    title: "Home",
  },
  {
    path: "/resume/",
    title: "Resume",
  },
  {
    path: "/projects/",
    title: "Portfolio",
  },
  {
    path: "/posts/",
    title: "Blog",
  },
  {
    path: "/about/",
    title: "About",
  },
];

export const siteConfig: SiteConfig = {
  author: "Enrique Quero",
  nickName: "Habakuk Beneke",
  date: {
    locale: "en-GB",
    options: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  },
  description: "An opinionated starter theme for Astro",
  title: "Enrique Quero's Resume",
};
