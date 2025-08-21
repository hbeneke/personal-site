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
