import { Note } from "../signal/notes.ts";

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
