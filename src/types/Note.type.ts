export interface Note {
	title: string;
	publishDate: string;
	slug: string;
	description: string;
	starred: boolean;
}

export interface NotesCollection {
	data: {
		notes: Note[];
	};
}

export interface GroupedNotesByYear extends Array<[string, Note[]]> {}
