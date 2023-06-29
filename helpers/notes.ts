import { Note, UUID } from "../signal/notes.ts";

export const findDescendantNotes = (note: Note, notes: Note[]): Note[] => {
  const descendants = notes.filter((n) => n.parent === note.uuid);
  return descendants.reduce((acc, curr) => {
    return [...acc, curr, ...findDescendantNotes(curr, notes)];
  }, [] as Note[]).concat(note);
};

export const focusNote = (uuid: UUID) => {
  setTimeout(() => {
    const previousNoteInput = document.querySelector(
      `input[data-uuid="${uuid}"]`,
    ) as HTMLInputElement;

    previousNoteInput?.focus();
  }, 0);
};

export const getDeepestChildNote = (note: Note, notes: Note[]): Note => {
  const childNotes = notes.filter((n: Note) => n.parent === note.uuid).sort((
    a,
    b,
  ) => a.createdAt - b.createdAt);

  if (childNotes.length === 0) return note;

  const lastChildNote = childNotes[childNotes.length - 1];

  return getDeepestChildNote(lastChildNote, notes);
};
