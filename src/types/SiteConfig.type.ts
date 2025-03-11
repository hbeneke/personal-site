interface SocialLinks {
	linkedin: string;
	github: string;
	x: string;
}

export interface SiteConfig {
	authorName: string;
	nickname: string;
	obfuscatedEmail: string;
	jobTitle: string;
	siteTitle: string;
	siteCreationYear: string;
	socialLinks: SocialLinks;
	copyrightYear: string;
}
