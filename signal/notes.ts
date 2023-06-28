import { debounce } from "$std/async/debounce.ts";
import { Signal, signal } from "@preact/signals";
import { USER_INPUT_DEBOUNCE_TIME_MILLIS } from "./../helpers/constants.ts";

export type UUID = string;
export type NoteParent = UUID | null;

export interface Note {
  uuid: UUID;
  content: string;
  parent: NoteParent;
  createdAt: number;
  updatedAt: number;
  pinned: boolean;
  focused: boolean;
}

export type NotesStateType = {
  notes: Signal<Note[]>;
  loadNotes: (userId: string) => Promise<void>;
  setNotes: (userId: string, notes: Note[]) => void;
  createNote: (userId: string, parent: NoteParent, content: string) => string;
  updateNote: (
    userId: string,
    uuid: UUID,
    content: string,
    pinned?: boolean,
    parent?: NoteParent,
  ) => void;
  deleteNote: (userId: string, uuid: UUID) => void;
  deleteAllNotes: (userId: string) => void;
  flushNotes: () => void;
  setNoteFocused: (userId: string, uuid: UUID, focused: boolean) => void;
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
  USER_INPUT_DEBOUNCE_TIME_MILLIS,
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

  const setNotes = (userId: string, newNotes: Note[]) => {
    notes.value = [...notes.value, ...newNotes];

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(userId, notes.value);
  };

  const createNote = (userId: string, parent: NoteParent, content = "") => {
    const now = new Date().getTime();
    const uuid = crypto.randomUUID();

    const note: Note = {
      uuid,
      content: content,
      parent,
      createdAt: now,
      updatedAt: now,
      pinned: false,
      focused: true,
    };

    notes.value = [...notes.value, note];

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(userId, notes.value);

    return uuid;
  };

  const updateNote = (
    userId: string,
    uuid: UUID,
    content: string,
    pinned?: boolean,
    parent?: NoteParent,
  ) => {
    const existingNote = notes.value.find((note: Note) => note.uuid === uuid);
    if (!existingNote) return;

    existingNote.content = content;
    existingNote.updatedAt = new Date().getTime();
    if (pinned !== undefined) existingNote.pinned = pinned;
    if (parent !== undefined) existingNote.parent = parent;

    notes.value = notes.value.map((note: Note) => {
      if (note.uuid === existingNote.uuid) return existingNote;

      return note;
    });

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(userId, notes.value);
  };

  const deleteNote = (userId: string, uuid: UUID) => {
    notes.value = notes.value.filter((note: Note) => note.uuid !== uuid);

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(userId, notes.value);
  };

  const deleteAllNotes = (userId: string) => {
    notes.value = [];

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(userId, notes.value);
  };

  const flushNotes = () => debouncedSaveNotesToDenoKV.flush();

  const setNoteFocused = (userId: string, uuid: UUID, focused: boolean) => {
    notes.value = notes.value.map((note: Note) => {
      if (note.uuid === uuid) {
        note.focused = focused;
      }

      return note;
    });

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(userId, notes.value);
  };

  return {
    notes,
    loadNotes,
    setNotes,
    createNote,
    updateNote,
    deleteNote,
    deleteAllNotes,
    flushNotes,
    setNoteFocused,
  };
};

export default NotesState();
