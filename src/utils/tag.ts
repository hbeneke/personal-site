import type { TagWithCount } from "@types";
import { getAllTags, getPostsByTag } from "@utils/post";

async function getTagsWithCounts(includeDrafts = false): Promise<TagWithCount[]> {
  const allTags = await getAllTags(includeDrafts);

  const tagsWithCounts = await Promise.all(
    allTags.map(async (tag) => {
      const posts = await getPostsByTag(tag, includeDrafts);
      return {
        name: tag,
        count: posts.length,
      };
    }),
  );

  return tagsWithCounts.filter((tag) => tag.count > 0);
}

export async function getAllTagsWithCounts(includeDrafts = false): Promise<TagWithCount[]> {
  return await getTagsWithCounts(includeDrafts);
}

export async function getSortedTagsWithCounts(includeDrafts = false): Promise<TagWithCount[]> {
  const tagsWithCounts = await getTagsWithCounts(includeDrafts);
  return tagsWithCounts.sort((a, b) => b.count - a.count);
}
