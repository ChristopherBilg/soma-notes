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

      deleteNote(auth.value.userId, uuid);

      // TODO: Focus on the previous note
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

      // Set the parent of the current note to the previous note
      const previousNote = e.shiftKey
        ? notes.value
            .filter((note: Note) => note.parent === null)
            .sort((a, b) => b.createdAt - a.createdAt)
            .find((note: Note) => note.createdAt < notes.value.find((note: Note) => note.uuid === uuid)?.createdAt)
        : notes.value
            .filter((note: Note) => note.parent === null)
            .sort((a, b) => a.createdAt - b.createdAt)
            .find((note: Note) => note.createdAt > notes.value.find((note: Note) => note.uuid === uuid)?.createdAt);

      if (!previousNote) return;

      updateNote(
        auth.value.userId,
        uuid,
        notes.value.find((note: Note) => note.uuid === uuid)?.content,
        previousNote.uuid
      );

      setTimeout(() => {
        const newNoteInput = document.querySelector(`input[data-uuid="${previousNote.uuid}"]`) as HTMLInputElement;
        newNoteInput?.focus();
      }, 0);
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
