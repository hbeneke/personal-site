export interface MenuLink {
  path: string;
  title: string;
}

interface SocialLinks {
  linkedin: string;
  github: string;
  x: string;
}

interface SiteConfig {
  authorName: string;
  nickname: string;
  obfuscatedEmail: string;
  jobTitle: string;
  siteTitle: string;
  siteCreationYear: string;
  socialLinks: SocialLinks;
  copyrightYear: string;
}
