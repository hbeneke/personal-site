import type { Note, NotesCollection, GroupedNotesByYear } from "@types";
import { getCollection } from "astro:content";

async function getNotes(sorted = false): Promise<Note[]> {
	const notes: NotesCollection[] = await getCollection("notes");
	const allNotes: Note[] = notes.flatMap((item) => item.data.notes);

	if (sorted) {
		return allNotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	}

	return allNotes;
}

export async function getAllNotes(sorted = true): Promise<Note[]> {
	return await getNotes(sorted);
}

export async function getLatestNote(): Promise<Note | undefined> {
	const sortedNotes: Note[] = await getNotes(true);
	return sortedNotes.length > 0 ? sortedNotes[0] : undefined;
}

export async function getLatestNotes(count = 1): Promise<Note[]> {
	const sortedNotes: Note[] = await getNotes(true);
	return sortedNotes.length > 0 ? sortedNotes.slice(0, count) : [];
}

export async function getNotesGroupedByYear(): Promise<GroupedNotesByYear> {
	const notes: Note[] = await getNotes();

	const groupedNotes: Record<number, Note[]> = notes.reduce(
		(acc: Record<number, Note[]>, note: Note) => {
			const year: number = new Date(note.date).getFullYear();
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(note);
			return acc;
		},
		{} as Record<number, Note[]>,
	);

	// Sort each year's notes by date (newest first)
	for (const yearNotes of Object.values(groupedNotes)) {
		yearNotes.sort((a: Note, b: Note) => new Date(b.date).getTime() - new Date(a.date).getTime());
	}

	// Sort years in descending order
	return Object.entries(groupedNotes).sort(
		(a: [string, Note[]], b: [string, Note[]]) => Number(b[0]) - Number(a[0]),
	);
}
