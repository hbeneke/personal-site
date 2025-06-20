interface SocialLinks {
  linkedin: string;
  github: string;
  x: string;
}

export interface SiteConfig {
  locale: string;
  authorName: string;
  nickname: string;
  obfuscatedEmail: string;
  jobTitle: string;
  siteTitle: string;
  siteCreationYear: string;
  siteUrl: string;
  socialLinks: SocialLinks;
  copyrightYear: string;
}
