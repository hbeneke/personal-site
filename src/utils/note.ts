import { getCollection } from "astro:content";
import type { GroupedNotesByYear, Note } from "@types";

async function getNotes(sorted = false): Promise<Note[]> {
  const notesCollection = await getCollection("notes");
  const allNotes: Note[] = notesCollection.map((entry) => ({
    title: entry.data.title,
    publishDate: entry.data.publishDate,
    slug: entry.data.slug,
    description: entry.data.description,
    starred: entry.data.starred,
  }));

  if (sorted) {
    return allNotes.sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
    );
  }

  return allNotes;
}

export async function getAllNotes(sorted = true): Promise<Note[]> {
  return await getNotes(sorted);
}

export async function getLatestNote(): Promise<Note | null> {
  const sortedNotes: Note[] = await getNotes(true);
  return sortedNotes.length > 0 ? sortedNotes[0] : null;
}

export async function getLatestNotes(count = 1): Promise<Note[]> {
  const sortedNotes: Note[] = await getNotes(true);
  return sortedNotes.length > 0 ? sortedNotes.slice(0, count) : [];
}

export async function getNotesGroupedByYear(): Promise<GroupedNotesByYear> {
  const notes: Note[] = await getNotes();

  const groupedNotes: Record<number, Note[]> = notes.reduce(
    (acc: Record<number, Note[]>, note: Note) => {
      const year: number = new Date(note.publishDate).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(note);
      return acc;
    },
    {} as Record<number, Note[]>,
  );

  for (const yearNotes of Object.values(groupedNotes)) {
    yearNotes.sort(
      (a: Note, b: Note) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
    );
  }

  return Object.entries(groupedNotes).sort(
    (a: [string, Note[]], b: [string, Note[]]) => Number(b[0]) - Number(a[0]),
  );
}
