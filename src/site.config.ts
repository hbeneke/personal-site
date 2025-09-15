import type { MenuLink, SiteConfig } from "@types";

export const menuLinks: MenuLink[] = [
  {
    path: "/",
    title: "Home",
  },
  {
    path: "/posts/",
    title: "Blog",
  },
  {
    path: "/portfolio/",
    title: "Portfolio",
  },
  {
    path: "/resume/",
    title: "Resume",
  },
  {
    path: "/about/",
    title: "About",
  },
];

export const siteConfig: SiteConfig = {
  locale: "en-US",
  authorName: "Enrique Quero",
  nickname: "Habakuk Beneke",
  obfuscatedEmail: "hbeneke [at] proton [dot] me",
  jobTitle: "Frontend Developer",
  siteTitle: "Enrique Quero",
  siteCreationYear: "2024",
  siteUrl: "https://habakukbeneke.com",
  socialLinks: {
    linkedin: "https://www.linkedin.com/in/equerodev/",
    github: "https://www.github.com/hbeneke",
    x: "https://x.com/habakukbeneke",
  },
  // Información de contacto y disponibilidad
  location: "Madrid, Spain",
  timezone: "CET (UTC+1)",
  availableForWork: true,
  workAvailability: {
    freelance: true,
    fullTime: true,
    remote: true,
    hybrid: true,
  },
  get copyrightYear() {
    return `${this.siteCreationYear}-${new Date().getFullYear().toString().slice(-2)}`;
  },
};
