import { siteConfig } from "@/site.config";
import { getLatestNotes } from "@/utils/note";
import rss from "@astrojs/rss";

/**
 * Astro GET endpoint that generates the RSS feed for the latest notes.
 *
 * Fetches the 10 most recent notes and maps them to RSS items, setting
 * the publication date from each note's `publishDate` field.
 *
 * @returns An RSS response object for the `/notes/rss.xml` route.
 */
export async function GET() {
  const latestNotes = await getLatestNotes(10);

  return rss({
    title: `${siteConfig.siteTitle} - Notes`,
    description: `Quick notes and updates from ${siteConfig.authorName}, ${siteConfig.jobTitle}`,
    site: siteConfig.siteUrl,
    items: latestNotes.map((note) => ({
      title: note.title,
      description: note.description,
      pubDate: new Date(note.publishDate),
      link: `/notes/${note.slug}/`,
    })),
    customData: "<language>en-us</language>",
  });
}
