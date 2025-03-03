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
  {
    path: "/notes/",
    title: "Notes",
  },
];

export const siteConfig: SiteConfig = {
  authorName: "Enrique Quero",
  nickname: "Habakuk Beneke",
  obfuscatedEmail: "habakukbeneke [at] proton [dot] me",
  jobTitle: "Frontend Developer",
  siteTitle: "Enrique Quero's Resume",
  siteCreationYear: "2024",
  socialLinks: {
    linkedin: "https://www.linkedin.com/in/equerodev/",
    github: "https://www.github.com/habakukbeneke",
    x: "https://x.com/habakukbeneke",
  },
  get copyrightYear() {
    return `${this.siteCreationYear}-${new Date().getFullYear().toString().slice(-2)}`;
  },
};
