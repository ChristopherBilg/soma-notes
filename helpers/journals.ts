// Copyright 2023-Present Soma Notes
import { Journal } from "../signal/journals.ts";

export const importJournals = (
  successCallbackFunc: (journals: Journal[]) => void,
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

      const allImportedJournals: Journal[] = [];

      importedData.forEach((data) => {
        if (typeof data !== "object") return failureCallbackFunc();

        const now = new Date().getTime();
        const journal: Journal = {
          uuid: data.uuid || "",
          date: data.date || "",
          content: data.content || "",
          createdAt: data.createdAt || now,
          updatedAt: data.updatedAt || now,
        };

        allImportedJournals.push(journal);
      });

      successCallbackFunc(allImportedJournals);
    });

    reader.readAsText(file);
  });

  fileInput.click();
};

export const exportJournals = (journals: Journal[]) => {
  const dataString = "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(journals));
  const filename = `soma-notes-journals-${new Date().toISOString()}`;

  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataString);
  downloadAnchorNode.setAttribute("download", filename + ".json");

  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};
