import { Signal, signal } from "@preact/signals";
import { generateUUID } from "./../helpers/uuid.ts";

export type NoteParent = string | null;

export interface Note {
  uuid: string;
  content: string;
  parent: NoteParent;
  createdAt: number;
  updatedAt: number;
  pinned: boolean;
}

export type NotesStateType = {
  notes: Signal<Note[]>;
  createNote: (parent: NoteParent, content: string) => string;
  updateNote: (uuid: string, content: string) => void;
  deleteNote: (uuid: string) => void;
};

const createAppState = (): NotesStateType => {
  const notes = signal<Note[]>([]);

  // TODO: Application State Persistence (load)

  const createNote = (parent: NoteParent, content = "") => {
    const now = new Date().getTime();
    const uuid = generateUUID();

    const note: Note = {
      uuid,
      content: content,
      parent,
      createdAt: now,
      updatedAt: now,
      pinned: false,
    };

    notes.value = [...notes.value, note];

    // TODO: Application State Persistence (save)

    return uuid;
  };

  const updateNote = (uuid: string, content: string) => {
    const now = new Date().getTime();
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

    // TODO: Application State Persistence (save)
  };

  const deleteNote = (uuid: string) => {
    notes.value = [...notes.value.filter((note: Note) => note.uuid !== uuid)];

    // TODO: Application State Persistence (save)
  };

  return { notes, createNote, updateNote, deleteNote };
};

export default createAppState();
