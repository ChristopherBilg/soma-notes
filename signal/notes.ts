// Copyright 2023 Soma Notes
import { debounce } from "$std/async/debounce.ts";
import { Signal, signal } from "@preact/signals";
import { USER_INPUT_DEBOUNCE_TIME_MILLIS } from "./../helpers/constants.ts";
import { AuthUser } from "./auth.ts";

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
  completed: boolean;
}

export type NotesStateType = {
  notes: Signal<Note[]>;
  loadNotes: (user: AuthUser) => Promise<void>;
  setNotes: (user: AuthUser, notes: Note[]) => void;
  createNote: (user: AuthUser, parent: NoteParent, content: string) => string;
  updateNote: (
    user: AuthUser,
    uuid: UUID,
    options?: {
      content?: string;
      pinned?: boolean;
      parent?: NoteParent;
      completed?: boolean;
    },
  ) => void;
  deleteNote: (user: AuthUser, uuid: UUID) => void;
  deleteAllNotes: (user: AuthUser) => void;
  flushNotes: () => void;
  setNoteFocused: (user: AuthUser, uuid: UUID, focused: boolean) => void;
};

const debouncedSaveNotesToDenoKV = debounce(
  async (user: AuthUser, notes: Note[]) =>
    await fetch("/api/notes", {
      method: "POST",
      headers: {
        "x-provider": user.provider || "",
        "x-user-id": user.userId || "",
      },
      body: JSON.stringify(notes),
    }),
  USER_INPUT_DEBOUNCE_TIME_MILLIS,
);

const NullNote: Note = {
  uuid: "",
  content: "",
  parent: null,
  createdAt: 0,
  updatedAt: 0,
  pinned: false,
  focused: true,
  completed: false,
};

const NotesState = (): NotesStateType => {
  const notes = signal<Note[]>([]);

  // Application State Persistence (load)
  const loadNotes = async (user: AuthUser) => {
    const response = await fetch("/api/notes", {
      headers: {
        "x-provider": user.provider || "",
        "x-user-id": user.userId || "",
      },
    });

    notes.value = await response.json();
  };

  const setNotes = (user: AuthUser, newNotes: Note[]) => {
    notes.value = [...notes.value, ...newNotes];

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(user, notes.value);
  };

  const createNote = (user: AuthUser, parent: NoteParent, content = "") => {
    const now = new Date().getTime();
    const uuid = crypto.randomUUID();

    const note: Note = {
      ...NullNote,
      uuid,
      content: content,
      parent,
      createdAt: now,
      updatedAt: now,
    };

    notes.value = [...notes.value, note];

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(user, notes.value);

    return uuid;
  };

  const updateNote = (
    user: AuthUser,
    uuid: UUID,
    options?: {
      content?: string;
      pinned?: boolean;
      parent?: NoteParent;
      completed?: boolean;
    },
  ) => {
    const existingNote = notes.value.find((note: Note) => note.uuid === uuid);
    if (!existingNote) return;

    existingNote.updatedAt = new Date().getTime();
    if (options?.content !== undefined) existingNote.content = options?.content;
    if (options?.pinned !== undefined) existingNote.pinned = options?.pinned;
    if (options?.parent !== undefined) existingNote.parent = options?.parent;
    if (options?.completed !== undefined) {
      existingNote.completed = options?.completed;
    }

    notes.value = notes.value.map((note: Note) => {
      if (note.uuid === existingNote.uuid) return existingNote;

      return note;
    });

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(user, notes.value);
  };

  const deleteNote = (user: AuthUser, uuid: UUID) => {
    notes.value = notes.value.filter((note: Note) => note.uuid !== uuid);

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(user, notes.value);
  };

  const deleteAllNotes = (user: AuthUser) => {
    notes.value = [];

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(user, notes.value);
  };

  const flushNotes = () => debouncedSaveNotesToDenoKV.flush();

  const setNoteFocused = (user: AuthUser, uuid: UUID, focused: boolean) => {
    notes.value = notes.value.map((note: Note) => {
      if (note.uuid === uuid) {
        note.focused = focused;
      }

      return note;
    });

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(user, notes.value);
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
