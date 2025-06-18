import rss from "@astrojs/rss";
import { getLatestPosts } from "@/utils/post";
import { siteConfig } from "@/site.config";

export async function GET() {
  const latestPosts = await getLatestPosts(20);

  return rss({
    title: `${siteConfig.siteTitle} - Posts`,
    description: `Latest blog posts from ${siteConfig.authorName}, ${siteConfig.jobTitle}. Insights on web development, programming, and technology.`,
    site: siteConfig.siteUrl,
    items: latestPosts.map((post) => ({
      title: post.title,
      description: post.description,
      content: post.content,
      pubDate: new Date(post.publishDate),
      link: `/posts/${post.slug}/`,
      categories: post.tags || [],
    })),
    customData: "<language>en-us</language>",
  });
}
