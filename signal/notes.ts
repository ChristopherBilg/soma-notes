import { debounce } from "$std/async/debounce.ts";
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
  loadNotes: (userId: string) => Promise<void>;
  createNote: (userId: string, parent: NoteParent, content: string) => string;
  updateNote: (userId: string, uuid: string, content: string) => void;
  deleteNote: (userId: string, uuid: string) => void;
};

const debouncedSaveNotesToDenoKV = debounce(
  async (userId: string, notes: Note[]) =>
    await fetch("/api/notes", {
      method: "POST",
      headers: {
        "x-user-id": userId,
      },
      body: JSON.stringify(notes),
    }),
  1000,
);

const NotesState = (): NotesStateType => {
  const notes = signal<Note[]>([]);

  // Application State Persistence (load)
  const loadNotes = async (userId: string) => {
    const response = await fetch("/api/notes", {
      headers: {
        "x-user-id": userId,
      },
    });

    notes.value = await response.json();
  };

  const createNote = (userId: string, parent: NoteParent, content = "") => {
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

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(userId, notes.value);

    return uuid;
  };

  const updateNote = (userId: string, uuid: string, content: string) => {
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

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(userId, notes.value);
  };

  const deleteNote = (userId: string, uuid: string) => {
    notes.value = [...notes.value.filter((note: Note) => note.uuid !== uuid)];

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(userId, notes.value);
  };

  return { notes, loadNotes, createNote, updateNote, deleteNote };
};

export default NotesState();
