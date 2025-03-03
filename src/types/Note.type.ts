export interface Note {
  title: string;
  date: string;
  slug: string;
  description: string;
  starred: boolean;
}

export interface NotesCollection {
  data: {
    notes: Note[];
  };
}
