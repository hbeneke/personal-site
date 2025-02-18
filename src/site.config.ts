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
  securizedEmail: "habakukbeneke [at] proton [dot] me",
  jobPosition: "Frontend Developer",
  title: "Enrique Quero's Resume",
};
