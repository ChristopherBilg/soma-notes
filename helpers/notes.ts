// Copyright 2023-Present Soma Notes
import { UUID } from "../signal/common.ts";
import { Note } from "../signal/notes.ts";

export const importNotes = (
  successCallbackFunc: (notes: Note[]) => void,
  failureCallbackFunc: () => void,
) => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json";
  fileInput.addEventListener("change", (e1) => {
    const file = (e1.target as HTMLInputElement)?.files?.[0];
    if (!file) return failureCallbackFunc();

    const reader = new FileReader();
    reader.addEventListener("load", (e2) => {
      const importedData = JSON.parse((e2.target?.result as string) || "[]");

      if (!Array.isArray(importedData)) return failureCallbackFunc();

      const allImportedNotes: Note[] = [];

      importedData.forEach((data) => {
        if (typeof data !== "object") return failureCallbackFunc();

        const now = new Date().getTime();
        const note: Note = {
          uuid: data.uuid || "",
          content: data.content || "",
          createdAt: data.createdAt || now,
          updatedAt: data.updatedAt || now,
          pinned: data.pinned || false,
          parent: data.parent || null,
          focused: data.focused ?? true,
          completed: data.completed ?? false,
          emphasized: data.emphasized ?? false,
          order: data.order ?? 0,
          hardLinks: data.hardLinks || [],
        };

        allImportedNotes.push(note);
      });

      successCallbackFunc(allImportedNotes);
    });

    reader.readAsText(file);
  });

  fileInput.click();
};

export const exportNotes = (notes: Note[]) => {
  const dataString = "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(notes));
  const filename = `soma-notes-notes-${new Date().toISOString()}`;

  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataString);
  downloadAnchorNode.setAttribute("download", filename + ".json");

  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

const processString = (str: string): string =>
  str.replace(/[^a-zA-Z0-9]/g, " ") // Replace non-alphanumeric characters with spaces
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim() // Remove leading and trailing whitespace
    .toLowerCase(); // Convert to lowercase

export const matchesSearch = (
  search: string,
  text: string,
  smart = true,
): boolean => {
  if (search.length === 0) {
    return true;
  }

  if (smart) {
    search = processString(search);
    text = processString(text);
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

export const swapNoteOrderAndParent = (
  uuidA: UUID,
  uuidB: UUID,
  notes: Note[],
): Note[] => {
  const noteA = notes.find((n) => n.uuid === uuidA);
  const noteB = notes.find((n) => n.uuid === uuidB);

  if (!noteA || !noteB) return notes;

  const tempOrder = noteA.order;
  noteA.order = noteB.order;
  noteB.order = tempOrder;

  const tempParent = noteA.parent;
  noteA.parent = noteB.parent;
  noteB.parent = tempParent;

  const modifiedNotes = [noteA, noteB];

  // Swap the parent of all children of noteA and noteB
  notes.forEach((n) => {
    if (n.parent === noteA.uuid) {
      n.parent = noteB.uuid;
      modifiedNotes.push(n);
    } else if (n.parent === noteB.uuid) {
      n.parent = noteA.uuid;
      modifiedNotes.push(n);
    }
  });

  return modifiedNotes;
};

export const getDeepestChildNote = (note: Note, notes: Note[]): Note => {
  const childNotes = notes.filter((n: Note) => n.parent === note.uuid).sort((
    a,
    b,
  ) => a.order - b.order);

  if (childNotes.length === 0) return note;

  const lastChildNote = childNotes[childNotes.length - 1];

  return getDeepestChildNote(lastChildNote, notes);
};
