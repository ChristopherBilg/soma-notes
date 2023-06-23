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

      // Focus on the previous note
      const previousNoteInput = document
        .querySelector(`input[data-uuid="${uuid}"]`)
        ?.parentNode?.previousElementSibling?.querySelector(
          "input",
        ) as HTMLInputElement;
      previousNoteInput?.focus();

      // Update all parent UUID of all child notes to be the parent of the deleted note
      const parentUUID = note.parent;
      notes.value
        .filter((note: Note) => note.parent === uuid)
        .forEach((note: Note) => {
          updateNote(
            auth.value.userId,
            note.uuid,
            note.content,
            undefined,
            parentUUID,
          );
        });

      deleteNote(auth.value.userId, uuid);
    }

    if (e.key === "Enter") {
      e.preventDefault();

      const parentUUID = note.parent;

      const newNoteUUID = createNote(auth.value.userId, parentUUID, "");
      setTimeout(() => {
        const newNoteInput = document.querySelector(
          `input[data-uuid="${newNoteUUID}"]`,
        ) as HTMLInputElement;
        newNoteInput?.focus();
      }, 0);
    }

    if (e.key === "Tab") {
      e.preventDefault();

      // Update the parent of the current note to be the uuid of the previous note in the DOM tree
      const previousNoteInput = document
        .querySelector(`input[data-uuid="${uuid}"]`)
        ?.parentNode?.previousElementSibling?.querySelector(
          "input",
        ) as HTMLInputElement;
      const parentUUID = previousNoteInput?.dataset.uuid;

      // Re-focus on the current note
      setTimeout(() => {
        const currentNoteInput = document.querySelector(
          `input[data-uuid="${uuid}"]`,
        ) as HTMLInputElement;
        currentNoteInput?.focus();
      }, 0);

      updateNote(
        auth.value.userId,
        uuid,
        note.content,
        undefined,
        parentUUID,
      );
    }

    if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();

      // Update the parent of the current note to be the grandparent of the current note
      updateNote(
        auth.value.userId,
        uuid,
        note.content,
        undefined,
        null,
      );
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
