import rss from "@astrojs/rss";
import { getLatestPosts } from "@/utils/post";
import { siteConfig } from "@/site.config";

export async function GET(context) {
	const latestPosts = await getLatestPosts(10);

	return rss({
		title: siteConfig.siteTitle,
		description: `Professional updates and posts from ${siteConfig.authorName}, ${siteConfig.jobTitle}`,
		site: context.site,
		items: latestPosts.map((post) => ({
			title: post.title,
			description: post.description,
			pubDate: new Date(post.date),
			link: `/posts/${post.slug}/`,
		})),
		customData: "<language>en-us</language>",
	});
}
