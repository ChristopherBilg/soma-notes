// Copyright 2023 Soma Notes
import { Note, UUID } from "../signal/notes.ts";

export const importNotes = (callbackFunc: (notes: Note[]) => void) => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json";
  fileInput.addEventListener("change", (e1) => {
    const file = (e1.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", (e2) => {
      const importedData = JSON.parse((e2.target?.result as string) || "[]");

      if (!Array.isArray(importedData)) return;

      importedData.forEach((data) => {
        if (typeof data !== "object") return;

        const allImportedNotes: Note[] = [];

        const now = new Date().getTime();
        const note: Note = {
          uuid: data.uuid || "",
          content: data.content || "",
          createdAt: data.createdAt || now,
          updatedAt: data.updatedAt || now,
          pinned: data.pinned || false,
          parent: data.parent || null,
          focused: data.focused ?? true,
        };

        allImportedNotes.push(note);

        callbackFunc(allImportedNotes);
      });
    });

    reader.readAsText(file);
  });

  fileInput.click();
};

export const exportNotes = (notes: Note[]) => {
  const dataString = "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(notes));
  const filename = `soma-notes-${new Date().toISOString()}`;

  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataString);
  downloadAnchorNode.setAttribute("download", filename + ".json");

  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const matchesSearch = (search: string, text: string): boolean => {
  if (search.length === 0) {
    return true;
  }

  const searchWords = search.split(" ");
  const textWords = text.split(" ");

  return searchWords.every((searchWord) => {
    return textWords.some((textWord) => {
      return textWord.toLowerCase().includes(searchWord.toLowerCase());
    });
  });
};

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

export const getNgrams = (splitStr: string[], n: number): string[][] | null => {
  const ngrams = [];

  if (splitStr.length < n) return null;

  for (let i = 0; i < splitStr.length - n + 1; i++) {
    ngrams.push(splitStr.slice(i, i + n));
  }

  return ngrams;
};

const processStrForNgrams = (str: string): string =>
  str
    .replace(/[^a-zA-Z0-9]/g, " ") // Replace non-alphanumeric characters with spaces
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim() // Remove leading and trailing whitespace
    .toLowerCase(); // Convert to lowercase

export const getAllNgrams = (str: string): string[][] => {
  const processedStr = processStrForNgrams(str);
  const splitStr = processedStr.split(" ");
  const ngrams = [];

  for (let i = 1; i <= splitStr.length; i++) {
    const ngram = getNgrams(splitStr, i);
    if (ngram) ngrams.push(...ngram);
  }

  return ngrams;
};
