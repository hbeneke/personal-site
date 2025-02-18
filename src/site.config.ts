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

export const siteConfig: SiteConfig & { copyrightYear: string } = {
  authorName: "Enrique Quero",
  nickname: "Habakuk Beneke",
  obfuscatedEmail: "habakukbeneke [at] proton [dot] me",
  jobTitle: "Frontend Developer",
  siteTitle: "Enrique Quero's Resume",
  siteCreationYear: "2024",
  get copyrightYear() {
    return `${this.siteCreationYear}-${new Date().getFullYear().toString().slice(-2)}`;
  },
};
