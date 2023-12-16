// Copyright 2023-Present Soma Notes
import { debounce } from "$std/async/debounce.ts";
import { useContext, useEffect } from "preact/hooks";
import { UI_UPDATE_DEBOUNCE_TIME_MILLIS } from "../helpers/constants.ts";
import {
  getDeepestChildNote,
  swapNoteOrderAndParent,
} from "../helpers/notes.ts";
import {
  debouncedAdjustNoteTextareaHeight,
  focusHTMLElement,
} from "../helpers/ui.ts";
import { UUID } from "../signal/common.ts";
import { getMaxNoteCount, getMaxNoteLength, Note } from "../signal/notes.ts";
import AnchorButton from "./AnchorButton.tsx";
import TextareaSelectionPopover from "./TextareaSelectionPopover.tsx";
import Tooltip from "./Tooltip.tsx";
import {
  AuthContext,
  NotesContext,
  UIContext,
} from "./context/CommonContext.tsx";

type NoteTextareaProps = {
  uuid: string;
  isIndividualNoteView?: boolean;
  recursion?: boolean;
};

const NoteTextarea = (
  { uuid, isIndividualNoteView, recursion }: NoteTextareaProps,
) => {
  const {
    notes,
    createNote,
    deleteNote,
    updateNote,
    flushNotes,
  } = useContext(
    NotesContext,
  );
  const { auth } = useContext(AuthContext);
  const { textareaSelection, setTextareaSelection, addToast } = useContext(
    UIContext,
  );

  const note = notes.value.find((note: Note) => note.uuid === uuid);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!auth?.value?.userId) return;
    if (!note) return;

    if (e.key === "Backspace") {
      if (note.content !== "") return;

      e.preventDefault();

      // Get the previous sibling note
      const previousSiblingNote = notes.value
        .filter((n: Note) => n.parent === note.parent)
        .sort((a, b) => a.order - b.order)
        .findLast((n: Note) => n.order < note.order && n.uuid !== uuid);

      if (previousSiblingNote) {
        // Get the deepest child note of the previous sibling note
        const deepestChildNote = getDeepestChildNote(
          previousSiblingNote,
          notes.value,
        );

        focusHTMLElement(`textarea[data-uuid="${deepestChildNote.uuid}"]`);
      } else {
        // If there is no previous sibling, get the parent note
        const parentNote = notes.value.find((n: Note) =>
          n.uuid === note.parent
        );

        if (parentNote) {
          focusHTMLElement(`textarea[data-uuid="${parentNote.uuid}"]`);
        }
      }

      // Update all parent UUID of all child notes to be the parent of the deleted note
      notes.value
        .filter((n: Note) => n.parent === uuid)
        .forEach((n: Note) => {
          updateNote(
            auth.value,
            n.uuid,
            {
              parent: note.parent,
            },
          );
        });

      // Delete the note and, if needed, redirect to the parent note
      deleteNote(auth.value, uuid);

      if (isIndividualNoteView) {
        const parentNoteHref = note?.parent
          ? `/notes/${note.parent}`
          : "/notes";

        flushNotes();

        setTimeout(() => {
          window.location.href = parentNoteHref;
        }, 0);
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();

      const maxNoteCount = getMaxNoteCount(auth.value.subscription);

      if (e.shiftKey) {
        if (notes.value.length >= maxNoteCount) {
          addToast(
            `You have reached the maximum number of notes (${maxNoteCount}).`,
          );
          return;
        }

        const newNoteUUID = createNote(auth.value, uuid);
        if (!newNoteUUID) return;

        // Focus on the new note
        focusHTMLElement(`textarea[data-uuid="${newNoteUUID}"]`);
      } else {
        if (notes.value.length >= maxNoteCount) {
          addToast(
            `You have reached the maximum number of notes (${maxNoteCount}).`,
          );
          return;
        }

        const parentNoteUUID = isIndividualNoteView ? uuid : note.parent;
        const newNoteUUID = createNote(
          auth.value,
          parentNoteUUID,
        );
        if (!newNoteUUID) return;

        // Focus on the new note
        focusHTMLElement(`textarea[data-uuid="${newNoteUUID}"]`);
      }
    }

    if (e.key === "Tab") {
      e.preventDefault();

      if (e.shiftKey) {
        // Get the previous note
        const parentNote = notes.value.find((n: Note) =>
          n.uuid === note.parent
        );

        if (!parentNote) return;

        // Update the current note's parent to be the previous note's UUID
        updateNote(
          auth.value,
          note.uuid,
          {
            parent: parentNote.parent,
          },
        );

        // Focus on the current note
        focusHTMLElement(`textarea[data-uuid="${uuid}"]`);
      } else {
        // Get the previous note
        const previousNote = notes.value
          .filter((n: Note) => n.parent === note.parent)
          .sort((a, b) => a.order - b.order)
          .findLast((n: Note) => n.order < note.order && n.uuid !== uuid);

        if (!previousNote) return;

        // Update the current note's parent to be the previous note's UUID
        updateNote(
          auth.value,
          note.uuid,
          {
            parent: previousNote.uuid,
          },
        );

        // Focus on the current note
        focusHTMLElement(`textarea[data-uuid="${uuid}"]`);
      }
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      // Get the previous sibling note
      const previousSiblingNote = notes.value
        .filter((n: Note) => n.parent === note.parent)
        .sort((a, b) => a.order - b.order)
        .findLast((n: Note) => n.order < note.order && n.uuid !== uuid);

      if (previousSiblingNote) {
        // Get the deepest child note of the previous sibling note
        const deepestChildNote = getDeepestChildNote(
          previousSiblingNote,
          notes.value,
        );

        if (e.altKey) {
          swapNoteOrderAndParent(uuid, deepestChildNote.uuid, notes.value)
            .forEach((n: Note) =>
              updateNote(
                auth.value,
                n.uuid,
                {
                  parent: n.parent,
                  order: n.order,
                },
              )
            );

          focusHTMLElement(`textarea[data-uuid="${uuid}"]`);

          setTimeout(() => {
            debouncedAdjustNoteTextareaHeight();
            debouncedAdjustNoteTextareaHeight.flush();
          }, 0);

          return;
        }

        focusHTMLElement(`textarea[data-uuid="${deepestChildNote.uuid}"]`);

        return;
      }

      // If there is no previous sibling, get the parent note
      const parentNote = notes.value.find((n: Note) => n.uuid === note.parent);

      if (parentNote) {
        if (e.altKey) {
          swapNoteOrderAndParent(uuid, parentNote.uuid, notes.value).forEach((
            n: Note,
          ) =>
            updateNote(
              auth.value,
              n.uuid,
              {
                parent: n.parent,
                order: n.order,
              },
            )
          );

          focusHTMLElement(`textarea[data-uuid="${uuid}"]`);

          setTimeout(() => {
            debouncedAdjustNoteTextareaHeight();
            debouncedAdjustNoteTextareaHeight.flush();
          }, 0);

          return;
        }

        focusHTMLElement(`textarea[data-uuid="${parentNote.uuid}"]`);

        return;
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();

      const getNextSiblingNote = (note: Note): Note | undefined => {
        const siblingNotes = notes.value
          .filter((n: Note) => n.parent === note.parent)
          .sort((a, b) => a.order - b.order);

        const nextSiblingNote = siblingNotes.find(
          (n: Note) => n.order > note.order && n.uuid !== uuid,
        );

        return nextSiblingNote;
      };

      const getFirstChildNote = (note: Note): Note | undefined => {
        const childNotes = notes.value
          .filter((n: Note) => n.parent === note.uuid)
          .sort((a, b) => a.order - b.order);

        if (childNotes.length !== 0) return childNotes[0];

        return;
      };

      const getNextNote = (note: Note): Note | undefined => {
        const nextSiblingNote = getNextSiblingNote(note);

        if (nextSiblingNote) return nextSiblingNote;

        const parentNote = notes.value.find((n: Note) =>
          n.uuid === note.parent
        );

        if (parentNote) return getNextNote(parentNote);

        return;
      };

      const firstChildNote = getFirstChildNote(note);

      if (firstChildNote) {
        if (e.altKey) {
          swapNoteOrderAndParent(uuid, firstChildNote.uuid, notes.value)
            .forEach((n: Note) =>
              updateNote(
                auth.value,
                n.uuid,
                {
                  parent: n.parent,
                  order: n.order,
                },
              )
            );

          focusHTMLElement(`textarea[data-uuid="${uuid}"]`);

          setTimeout(() => {
            debouncedAdjustNoteTextareaHeight();
            debouncedAdjustNoteTextareaHeight.flush();
          }, 0);

          return;
        }

        focusHTMLElement(`textarea[data-uuid="${firstChildNote.uuid}"]`);

        return;
      }

      const nextNote = getNextNote(note);

      if (nextNote) {
        if (e.altKey) {
          swapNoteOrderAndParent(uuid, nextNote.uuid, notes.value)
            .forEach((n: Note) =>
              updateNote(
                auth.value,
                n.uuid,
                {
                  parent: n.parent,
                  order: n.order,
                },
              )
            );

          focusHTMLElement(`textarea[data-uuid="${uuid}"]`);

          setTimeout(() => {
            debouncedAdjustNoteTextareaHeight();
            debouncedAdjustNoteTextareaHeight.flush();
          }, 0);

          return;
        }

        focusHTMLElement(`textarea[data-uuid="${nextNote.uuid}"]`);

        return;
      }
    }
  };

  const handleInput = (e: Event) => {
    if (!auth.value.userId) return;

    const target = e.target as HTMLTextAreaElement;
    let content = target.value;

    const maxNoteContentLength = getMaxNoteLength(auth.value.subscription);
    if (content.length >= maxNoteContentLength) {
      addToast(
        `Note content is too long, max length is ${maxNoteContentLength} characters`,
      );
      content = content.substring(0, maxNoteContentLength);
    }

    updateNote(auth.value, uuid, { content });
  };

  const debouncedTextareaSelection = debounce(
    (
      selectedText: string,
      offsetTop: number,
      offsetLeft: number,
      uuid: UUID,
    ) => {
      setTextareaSelection(selectedText, offsetTop, offsetLeft, uuid);
    },
    UI_UPDATE_DEBOUNCE_TIME_MILLIS,
  );

  const handleSelect = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    const selectionStart = target.selectionStart;
    const selectionEnd = target.selectionEnd;

    const selectedText = target.value.substring(
      selectionStart,
      selectionEnd,
    );

    debouncedTextareaSelection(
      selectedText,
      target.offsetTop,
      target.offsetLeft,
      uuid,
    );
  };

  useEffect(() => {
    debouncedAdjustNoteTextareaHeight();
  }, [note?.content]);

  const clearTextareaSelectionPopover = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.id !== "selected-text-popover") {
      setTextareaSelection("", 0, 0, "");
    }
  };

  useEffect(() => {
    // Click
    globalThis.addEventListener("click", clearTextareaSelectionPopover);
    const interval = setInterval(() => {
      if (window?.getSelection()?.toString() === "") {
        setTextareaSelection("", 0, 0, "");
      }
    }, 100);

    // Resize
    globalThis.addEventListener(
      "resize",
      () => debouncedAdjustNoteTextareaHeight(),
    );

    // Initial textarea height adjustment
    debouncedAdjustNoteTextareaHeight();

    // Cleanup
    return () => {
      globalThis.removeEventListener("click", clearTextareaSelectionPopover);
      globalThis.removeEventListener(
        "resize",
        () => debouncedAdjustNoteTextareaHeight(),
      );
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {textareaSelection.value.uuid === uuid && (
        <TextareaSelectionPopover
          selectedText={textareaSelection.value.selectedText}
          offsetTop={textareaSelection.value.offsetTop}
          offsetLeft={textareaSelection.value.offsetLeft}
          uuid={textareaSelection.value.uuid}
        />
      )}

      <div class="flex">
        <input
          type="radio"
          class="my-auto w-3 h-3"
          checked={!note?.focused}
          onClick={() =>
            updateNote(auth.value, uuid, { focused: !note?.focused })}
        />

        <textarea
          class={`
            border-none bg-transparent rounded-md w-full mx-2 px-2 py-1 my-auto resize-none h-6
            ${note?.completed ? "line-through" : ""}
            ${note?.pinned ? "italic" : ""}
            ${note?.emphasized ? "font-bold" : ""}
          `}
          placeholder="Add a note"
          type="text"
          data-uuid={uuid}
          value={note?.content}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          onSelect={handleSelect}
          spellcheck={false}
        />

        <div class="my-auto">
          <Tooltip text="Link">
            <AnchorButton
              title="L"
              href={`/notes/${uuid}`}
              minimal
              lighter
              monospaced
            />
          </Tooltip>
        </div>
      </div>

      {(recursion && note?.focused) && (
        <>
          <ul class="ml-5">
            {note.hardLinks
              .map((hardLink) => notes.value.find((n) => n.uuid === hardLink))
              .sort((a, b) => (a?.order || 0) - (b?.order || 0))
              .map((n) => (
                <div class="flex justify-between ml-2">
                  <a
                    class="text-gray-500 hover:underline break-words"
                    href={`/notes/${n?.uuid}`}
                  >
                    {n?.content || "Empty note"}
                  </a>

                  <div class="my-auto">
                    <Tooltip text="Remove hard link">
                      <AnchorButton
                        title="H"
                        onClick={() => {
                          // Remove the hard link for both notes
                          updateNote(
                            auth.value,
                            uuid,
                            {
                              hardLinks: note.hardLinks.filter(
                                (hardLink) => hardLink !== n?.uuid,
                              ),
                            },
                          );

                          updateNote(
                            auth.value,
                            n?.uuid!,
                            {
                              hardLinks: n?.hardLinks.filter(
                                (hardLink) => hardLink !== uuid,
                              ),
                            },
                          );
                        }}
                        minimal
                        lighter
                        monospaced
                      />
                    </Tooltip>
                  </div>
                </div>
              ))}
          </ul>

          <ul class="ml-4">
            {(notes.value as Note[])
              .filter((childNote) => childNote.parent === uuid)
              .sort((a, b) => a.order - b.order)
              .map((childNote) => (
                <li>
                  <NoteTextarea uuid={childNote.uuid} recursion />
                </li>
              ))}
          </ul>
        </>
      )}
    </>
  );
};

export default NoteTextarea;
