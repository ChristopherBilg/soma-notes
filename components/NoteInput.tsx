import { useContext } from "preact/hooks";
import { matchesSearch } from "../helpers/search.ts";
import { Note } from "../signal/notes.ts";
import { AuthContext, NotesContext, UIContext } from "./Context.tsx";

interface NoteInputProps {
  uuid: string;
}

const NoteInput = ({ uuid }: NoteInputProps) => {
  const { notes, createNote, deleteNote, updateNote } = useContext(
    NotesContext,
  );
  const { auth } = useContext(AuthContext);
  const { searchField } = useContext(UIContext);

  const note = notes.value.find((note: Note) => note.uuid === uuid);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!auth?.value?.userId) return;
    if (!note) return;

    if (e.key === "Backspace") {
      if (note.content !== "") return;

      e.preventDefault();

      // Update all parent UUID of all child notes to be the parent of the deleted note
      const parentUUID = note.parent;
      notes.value
        .filter((n: Note) => n.parent === uuid)
        .forEach((n: Note) => {
          updateNote(
            auth.value.userId || "",
            n.uuid,
            n.content,
            undefined,
            parentUUID,
          );
        });

      // Focus on the previous note sibling
      let previousNote = notes.value
        .filter((n: Note) => n.parent === note.parent)
        .sort((a, b) => a.createdAt - b.createdAt)
        .findLast((n: Note) => n.createdAt < note.createdAt && n.uuid !== uuid);

      // If there is no previous note sibling, focus on the parent note
      if (!previousNote) {
        previousNote = notes.value.find((n: Note) => n.uuid === note.parent);
      }

      if (previousNote) {
        setTimeout(() => {
          const previousNoteInput = document.querySelector(
            `input[data-uuid="${previousNote?.uuid}"]`,
          ) as HTMLInputElement;

          previousNoteInput?.focus();
        }, 0);
      }

      deleteNote(auth.value.userId, uuid);
    }

    if (e.key === "Enter") {
      e.preventDefault();

      const newNoteUUID = createNote(auth.value.userId, note.parent, "");

      // Focus on the new note
      setTimeout(() => {
        const newNoteInput = document.querySelector(
          `input[data-uuid="${newNoteUUID}"]`,
        ) as HTMLInputElement;

        newNoteInput?.focus();
      }, 0);
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
          auth.value.userId || "",
          note.uuid,
          note.content,
          undefined,
          parentNote.parent,
        );

        // Focus on the current note
        setTimeout(() => {
          const currentNoteInput = document.querySelector(
            `input[data-uuid="${uuid}"]`,
          ) as HTMLInputElement;

          currentNoteInput?.focus();
        }, 0);
      } else {
        // Get the previous note
        const previousNote = notes.value
          .filter((n: Note) => n.parent === note.parent)
          .sort((a, b) => a.createdAt - b.createdAt)
          .findLast((n: Note) =>
            n.createdAt < note.createdAt && n.uuid !== uuid
          );

        if (!previousNote) return;

        // Update the current note's parent to be the previous note's UUID
        updateNote(
          auth.value.userId || "",
          note.uuid,
          note.content,
          undefined,
          previousNote.uuid,
        );

        // Focus on the current note
        setTimeout(() => {
          const currentNoteInput = document.querySelector(
            `input[data-uuid="${uuid}"]`,
          ) as HTMLInputElement;

          currentNoteInput?.focus();
        }, 0);
      }
    }
  };

  const handleInput = (e: Event) => {
    if (!auth?.value?.userId) return;

    const target = e.target as HTMLInputElement;
    const content = target.value;

    updateNote(auth.value.userId, uuid, content);
  };

  return (
    <>
      <input
        class="border-none bg-transparent rounded-md w-full"
        placeholder="Add a note"
        type="text"
        data-uuid={uuid}
        value={note?.content}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
      />

      <ul class="list-disc ml-4">
        {(notes.value as Note[])
          .filter((note) => matchesSearch(searchField.value, note.content))
          .filter((childNote) => childNote.parent === uuid)
          .sort((a, b) => a.createdAt - b.createdAt)
          .map((childNote) => (
            <li>
              <NoteInput uuid={childNote.uuid} />
            </li>
          ))}
      </ul>
    </>
  );
};

export default NoteInput;
