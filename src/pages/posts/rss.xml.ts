import { siteConfig } from "@/site.config";
import { getLatestPosts } from "@/utils/post";
import rss from "@astrojs/rss";

/**
 * Astro GET endpoint that generates the RSS feed for the latest blog posts.
 *
 * Fetches the 20 most recent published posts and maps them to RSS items,
 * including optional fields such as tags (as categories), read time, and
 * last updated date when available.
 *
 * @returns An RSS response object for the `/posts/rss.xml` route.
 */
export async function GET() {
  const latestPosts = await getLatestPosts(20);

  return rss({
    title: `${siteConfig.siteTitle} - Posts`,
    description: `Latest blog posts from ${siteConfig.authorName}, ${siteConfig.jobTitle}. Insights on web development, programming, and technology.`,
    site: siteConfig.siteUrl,
    items: latestPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      content: post.data.content,
      pubDate: new Date(post.data.publishDate),
      link: `/posts/${post.data.slug}/`,
      categories: post.data.tags || [],
      readTime: post.data.readTime,
      updatedDate: post.data.updatedDate,
    })),
    customData: "<language>en-us</language>",
  });
}
