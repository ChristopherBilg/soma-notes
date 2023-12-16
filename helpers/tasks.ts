// Copyright 2023-Present Soma Notes
import { Category, Frequency, Task } from "../signal/tasks.ts";

export const importTasks = (
  successCallbackFunc: (tasks: Task[]) => void,
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

      const allImportedTasks: Task[] = [];

      importedData.forEach((data) => {
        if (typeof data !== "object") return failureCallbackFunc();

        const now = new Date().getTime();
        const task: Task = {
          uuid: data.uuid || "",
          content: data.content || "",
          lastCompletedAt: data.lastCompletedAt || "",
          nextDueAt: data.nextDueAt || "",
          frequency: data.frequency || Frequency.Daily,
          category: data.category || Category.General,
          createdAt: data.createdAt || now,
          updatedAt: data.updatedAt || now,
        };

        allImportedTasks.push(task);
      });

      successCallbackFunc(allImportedTasks);
    });

    reader.readAsText(file);
  });

  fileInput.click();
};

export const exportTasks = (tasks: Task[]) => {
  const dataString = "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(tasks));
  const filename = `soma-notes-tasks-${new Date().toISOString()}`;

  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataString);
  downloadAnchorNode.setAttribute("download", filename + ".json");

  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};
