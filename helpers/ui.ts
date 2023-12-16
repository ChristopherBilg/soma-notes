// Copyright 2023-Present Soma Notes
import { debounce } from "$std/async/debounce.ts";

export const focusHTMLElement = (selector: string) => {
  setTimeout(() => {
    const focusableHTMLElement = document.querySelector(
      selector,
    ) as HTMLInputElement | HTMLTextAreaElement | null;

    focusableHTMLElement?.focus();
  }, 0);
};

export const debouncedAdjustNoteTextareaHeight = debounce(
  () =>
    document.querySelectorAll(
      `textarea[data-uuid]`,
    ).forEach((t) => {
      const t_ = t as HTMLTextAreaElement;

      t_.style.height = "1px";
      t_.style.height = `${t_.scrollHeight}px`;
    }),
  0, // Was UI_UPDATE_DEBOUNCE_TIME_MILLIS
);

export const debouncedAdjustJournalTextareaHeight = debounce(
  () => {
    const journalTextarea = document.querySelector(
      "#journal-content",
    ) as HTMLTextAreaElement | null;

    if (journalTextarea) {
      journalTextarea.style.height = "1px";
      journalTextarea.style.height = `${journalTextarea.scrollHeight}px`;
    }
  },
  0, // Was UI_UPDATE_DEBOUNCE_TIME_MILLIS
);
