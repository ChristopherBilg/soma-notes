// Copyright 2023-Present Soma Notes
import { debounce } from "$std/async/debounce.ts";
import { Signal, signal } from "@preact/signals";
import {
  API_REQUEST_DEBOUNCE_TIME_MILLIS,
  MAX_FREE_NOTE_CONTENT_LENGTH,
  MAX_FREE_NOTE_COUNT,
  MAX_PREMIUM_NOTE_CONTENT_LENGTH,
  MAX_PREMIUM_NOTE_COUNT,
  MAX_PROFESSIONAL_NOTE_CONTENT_LENGTH,
  MAX_PROFESSIONAL_NOTE_COUNT,
} from "../helpers/constants.ts";
import { AuthUser, Subscription } from "./auth.ts";
import { UUID } from "./common.ts";

export type NoteParent = UUID | null;

export type Note = {
  uuid: UUID;
  content: string;
  parent: NoteParent;
  createdAt: number;
  updatedAt: number;
  pinned: boolean;
  focused: boolean;
  completed: boolean;
  emphasized: boolean;
  order: number;
  hardLinks: UUID[];
};

const NullNote: Note = {
  uuid: "",
  content: "",
  parent: null,
  createdAt: 0,
  updatedAt: 0,
  pinned: false,
  focused: true,
  completed: false,
  emphasized: false,
  order: 0,
  hardLinks: [],
};

export type NotesStateType = {
  notes: Signal<Note[]>;
  notesNetworkRequestPending: Signal<boolean>;

  setupNotes: (
    user: AuthUser,
    loadFailureCallbackFunc: () => void,
    saveFailureCallbackFunc: () => void,
  ) => Promise<void>;
  setNotes: (user: AuthUser, notes: Note[]) => void;
  createNote: (
    user: AuthUser,
    parent: NoteParent,
  ) => string | undefined;
  updateNote: (
    user: AuthUser,
    uuid: UUID,
    options?: {
      content?: string;
      pinned?: boolean;
      parent?: NoteParent;
      focused?: boolean;
      completed?: boolean;
      emphasized?: boolean;
      order?: number;
      hardLinks?: UUID[];
    },
  ) => void;
  deleteNote: (user: AuthUser, uuid: UUID) => void;
  deleteAllNotes: (user: AuthUser) => void;
  flushNotes: () => void;
};

const debouncedSaveNotesToDenoKV = debounce(
  async (
    user: AuthUser,
    notes: Note[],
    saveFailureCallbackFunc: () => void,
    requestStartCallbackFunc: () => void,
    requestEndCallbackFunc: () => void,
  ) => {
    requestStartCallbackFunc();

    const response = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "x-provider": user.provider,
        "x-user-id": user.userId!,
      },
      body: JSON.stringify(notes),
    });

    if (!response.ok) saveFailureCallbackFunc();

    requestEndCallbackFunc();
  },
  API_REQUEST_DEBOUNCE_TIME_MILLIS,
);

export const getMaxNoteCount = (subscription: Subscription) => {
  let exhaustiveCheck: never;
  switch (subscription) {
    case Subscription.Professional:
      return MAX_PROFESSIONAL_NOTE_COUNT;
    case Subscription.Premium:
      return MAX_PREMIUM_NOTE_COUNT;
    case Subscription.Free:
      return MAX_FREE_NOTE_COUNT;
    default:
      exhaustiveCheck = subscription;
      console.error(`Unhandled subscription: ${exhaustiveCheck}`);
      return -1;
  }
};

export const getMaxNoteLength = (subscription: Subscription) => {
  let exhaustiveCheck: never;
  switch (subscription) {
    case Subscription.Professional:
      return MAX_PROFESSIONAL_NOTE_CONTENT_LENGTH;
    case Subscription.Premium:
      return MAX_PREMIUM_NOTE_CONTENT_LENGTH;
    case Subscription.Free:
      return MAX_FREE_NOTE_CONTENT_LENGTH;
    default:
      exhaustiveCheck = subscription;
      console.error(`Unhandled subscription: ${exhaustiveCheck}`);
      return -1;
  }
};

const NotesState = (): NotesStateType => {
  const notes = signal<Note[]>([]);
  const notesNetworkRequestPending = signal<boolean>(false);
  let saveFailureCallbackFunc_: () => void;

  const setNotesNetworkRequestPending =
    (isNetworkRequestPending: boolean) => () =>
      notesNetworkRequestPending.value = isNetworkRequestPending;

  // Application State Persistence (load) and callbacks
  const setupNotes = async (
    user: AuthUser,
    loadFailureCallbackFunc: () => void,
    saveFailureCallbackFunc: () => void,
  ) => {
    setNotesNetworkRequestPending(true)();

    saveFailureCallbackFunc_ = saveFailureCallbackFunc;

    const response = await fetch("/api/notes", {
      headers: {
        "x-provider": user.provider,
        "x-user-id": user.userId!,
      },
    });

    if (!response.ok) return loadFailureCallbackFunc();

    const loadedNotes: Note[] = await response.json();
    notes.value = loadedNotes;

    setNotesNetworkRequestPending(false)();
  };

  const setNotes = (user: AuthUser, newNotes: Note[]) => {
    notes.value = [
      ...notes.value,
      ...newNotes.map((n) => ({
        ...n,
        content: n.content.substring(0, getMaxNoteLength(user.subscription)),
      })),
    ];

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(
      user,
      notes.value,
      saveFailureCallbackFunc_,
      setNotesNetworkRequestPending(true),
      setNotesNetworkRequestPending(false),
    );
  };

  const createNote = (user: AuthUser, parent: NoteParent) => {
    if (notes.value.length > getMaxNoteCount(user.subscription)) {
      return undefined;
    }

    const now = new Date().getTime();
    const uuid = crypto.randomUUID();
    const order = Math.max(...notes.value.map((n) => n.order), 0) + 1;

    const note: Note = {
      ...NullNote,
      uuid,
      parent,
      createdAt: now,
      updatedAt: now,
      order,
    };

    notes.value = [...notes.value, note];

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(
      user,
      notes.value,
      saveFailureCallbackFunc_,
      setNotesNetworkRequestPending(true),
      setNotesNetworkRequestPending(false),
    );

    return uuid;
  };

  const updateNote = (
    user: AuthUser,
    uuid: UUID,
    options?: {
      content?: string;
      pinned?: boolean;
      parent?: NoteParent;
      focused?: boolean;
      completed?: boolean;
      emphasized?: boolean;
      order?: number;
      hardLinks?: UUID[];
    },
  ) => {
    const existingNote = notes.value.find((note: Note) => note.uuid === uuid);
    if (!existingNote) return;

    existingNote.updatedAt = new Date().getTime();
    if (options?.content !== undefined) {
      existingNote.content = options?.content.substring(
        0,
        getMaxNoteLength(user.subscription),
      );
    }
    if (options?.pinned !== undefined) existingNote.pinned = options?.pinned;
    if (options?.parent !== undefined) existingNote.parent = options?.parent;
    if (options?.focused !== undefined) existingNote.focused = options?.focused;
    if (options?.completed !== undefined) {
      existingNote.completed = options?.completed;
    }
    if (options?.emphasized !== undefined) {
      existingNote.emphasized = options?.emphasized;
    }
    if (options?.order !== undefined) existingNote.order = options?.order;
    if (options?.hardLinks !== undefined) {
      existingNote.hardLinks = options?.hardLinks;
    }

    notes.value = notes.value.map((note: Note) => {
      if (note.uuid === existingNote.uuid) return existingNote;

      return note;
    });

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(
      user,
      notes.value,
      saveFailureCallbackFunc_,
      setNotesNetworkRequestPending(true),
      setNotesNetworkRequestPending(false),
    );
  };

  const deleteNote = (user: AuthUser, uuid: UUID) => {
    notes.value = notes.value
      // Remove the deleted note
      .filter((note: Note) => note.uuid !== uuid)
      // Remove any hard links to this note
      .map((note: Note) => {
        if (note.hardLinks.includes(uuid)) {
          note.hardLinks = note.hardLinks.filter((hardLink) =>
            hardLink !== uuid
          );
        }

        return note;
      });

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(
      user,
      notes.value,
      saveFailureCallbackFunc_,
      setNotesNetworkRequestPending(true),
      setNotesNetworkRequestPending(false),
    );
  };

  const deleteAllNotes = (user: AuthUser) => {
    notes.value = [];

    // Application State Persistence (save)
    debouncedSaveNotesToDenoKV(
      user,
      notes.value,
      saveFailureCallbackFunc_,
      setNotesNetworkRequestPending(true),
      setNotesNetworkRequestPending(false),
    );
  };

  const flushNotes = () => debouncedSaveNotesToDenoKV.flush();

  return {
    notes,
    notesNetworkRequestPending,

    setupNotes,
    setNotes,
    createNote,
    updateNote,
    deleteNote,
    deleteAllNotes,
    flushNotes,
  };
};

export default NotesState();
