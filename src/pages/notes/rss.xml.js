import rss from "@astrojs/rss";
import { getLatestNotes } from "@/utils/note";
import { siteConfig } from "@/site.config";

export async function GET(context) {
	const latestNotes = await getLatestNotes(10);

	return rss({
		title: `${siteConfig.siteTitle} - Notes`,
		description: `Quick notes and updates from ${siteConfig.authorName}, ${siteConfig.jobTitle}`,
		site: context.site,
		items: latestNotes.map((note) => ({
			title: note.title,
			description: note.description,
			pubDate: new Date(note.date),
			link: `/notes/${note.slug}/`,
		})),
		customData: "<language>en-us</language>",
	});
}
