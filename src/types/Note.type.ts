export interface Note {
  title: string;
  date: string;
  description: string;
}

export interface NotesCollection {
  data: {
    notes: Note[];
  };
}
