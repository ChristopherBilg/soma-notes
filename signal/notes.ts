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

const NotesState = (): NotesStateType => {
  const notes = signal<Note[]>([]);

  // TODO: Application State Persistence (load)
  // Prerequisite: Find a way to get the authentication state loaded here
  //               (e.g. load from cookies, store in a new preact context, then in this file load from context)

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
    // Prerequisite: Find a way to get the authentication state loaded here
    //               (e.g. load from cookies, store in a new preact context, then in this file load from context)

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
    // Prerequisite: Find a way to get the authentication state loaded here
    //               (e.g. load from cookies, store in a new preact context, then in this file load from context)
  };

  const deleteNote = (uuid: string) => {
    notes.value = [...notes.value.filter((note: Note) => note.uuid !== uuid)];

    // TODO: Application State Persistence (save)
    // Prerequisite: Find a way to get the authentication state loaded here
    //               (e.g. load from cookies, store in a new preact context, then in this file load from context)
  };

  return { notes, createNote, updateNote, deleteNote };
};

export default NotesState();
