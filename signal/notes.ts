import { Signal, signal } from "@preact/signals";
import { generateUUID } from "./../helpers/uuid.ts";
export type NoteParent = string | null;

export interface Note {
  uuid: string;
  content: string;
  parent: NoteParent;
  createdAt: Date;
  updatedAt: Date;
  pinned: boolean;
}

export type NotesStateType = {
  notes: Signal<Note[]>;
  createNote: (parent: NoteParent) => void;
  updateNote: (uuid: string, content: string) => void;
  deleteNote: (uuid: string) => void;
};

const createAppState = (): NotesStateType => {
  const notes = signal<Note[]>([]);

  const createNote = (parent: NoteParent) => {
    const now = new Date();
    const note: Note = {
      uuid: generateUUID(),
      content: "",
      parent,
      createdAt: now,
      updatedAt: now,
      pinned: false,
    };

    notes.value = [...notes.value, note];
  };

  const updateNote = (uuid: string, content: string) => {
    const now = new Date();
    const note = notes.value.find((note: Note) => note.uuid === uuid);
    if (note) {
      note.content = content;
      note.updatedAt = now;
      notes.value = [...notes.value];
    }

    notes.value = [
      ...notes.value.map((note: Note) => {
        if (note.uuid === uuid) {
          return {
            ...note,
            content,
            updatedAt: now,
          };
        }
        return note;
      }),
    ];
  };

  const deleteNote = (uuid: string) => {
    notes.value = [...notes.value.filter((note: Note) => note.uuid !== uuid)];
  };

  return { notes, createNote, updateNote, deleteNote };
};

export default createAppState();
