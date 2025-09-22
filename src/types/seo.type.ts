export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  article?: boolean;
  publishDate?: string;
  modifiedDate?: string;
  canonicalUrl?: URL | string;
  noindex?: boolean;
  nofollow?: boolean;
  author?: string;
  tags?: string[];
}

export interface LayoutProps extends SEOProps {
  schemaType?: "WebSite" | "Person" | "BlogPosting" | "Article" | "BreadcrumbList";
}