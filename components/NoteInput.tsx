import { useContext } from "preact/hooks";
import { Note } from "../signal/notes.ts";
import { AuthContext, NotesContext } from "./Context.tsx";

interface NoteInputProps {
  uuid: string;
}

const NoteInput = ({ uuid }: NoteInputProps) => {
  const { notes, createNote, deleteNote, updateNote } = useContext(NotesContext);
  const { auth } = useContext(AuthContext);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!auth?.value?.userId) return;

    if (notes.value.find((note: Note) => note.uuid === uuid)?.content === "" && e.key === "Backspace") {
      e.preventDefault();

      // Focus on the previous note
      const previousNoteInput = document
        .querySelector(`input[data-uuid="${uuid}"]`)
        ?.parentNode?.previousElementSibling?.querySelector("input") as HTMLInputElement;
      previousNoteInput?.focus();

      // Update all parent UUID of all child notes to be the parent of the deleted note
      const parentUUID = notes.value.find((note: Note) => note.uuid === uuid)?.parent;
      notes.value
        .filter((note: Note) => note.parent === uuid)
        .forEach((note: Note) => {
          updateNote(auth.value.userId, note.uuid, note.content, parentUUID);
        });

      deleteNote(auth.value.userId, uuid);
    }

    if (e.key === "Enter") {
      e.preventDefault();

      const newNoteUUID = createNote(auth.value.userId, null, "");
      setTimeout(() => {
        const newNoteInput = document.querySelector(`input[data-uuid="${newNoteUUID}"]`) as HTMLInputElement;
        newNoteInput?.focus();
      }, 0);
    }

    if (e.key === "Tab") {
      e.preventDefault();

      // Update the parent of the current note to be the uuid of the previous note in the DOM tree
      const previousNoteInput = document
        .querySelector(`input[data-uuid="${uuid}"]`)
        ?.parentNode?.previousElementSibling?.querySelector("input") as HTMLInputElement;
      const parentUUID = previousNoteInput?.dataset.uuid;

      // Re-focus on the current note
      const currentNoteInput = document.querySelector(`input[data-uuid="${uuid}"]`) as HTMLInputElement;
      currentNoteInput?.focus();

      updateNote(
        auth.value.userId,
        uuid,
        notes.value.find((note: Note) => note.uuid === uuid)?.content,
        undefined,
        parentUUID
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
    <input
      class="border-none bg-transparent rounded-md w-full"
      placeholder="Add a note"
      type="text"
      data-uuid={uuid}
      value={notes.value.find((note: Note) => note.uuid === uuid)?.content}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
    />
  );
};

export default NoteInput;
