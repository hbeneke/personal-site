interface SocialLinks {
  linkedin: string;
  github: string;
  x: string;
}

interface WorkAvailability {
  freelance: boolean;
  fullTime: boolean;
  remote: boolean;
  hybrid: boolean;
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
  location: string;
  timezone: string;
  availableForWork: boolean;
  workAvailability: WorkAvailability;
  copyrightYear: string;
}
