import { useContext } from "preact/hooks";
import { Note } from "../signal/notes.ts";
import { AuthContext, NotesContext } from "./Context.tsx";

interface NoteInputProps {
  uuid: string;
}

const NoteInput = ({ uuid }: NoteInputProps) => {
  const { notes, deleteNote, updateNote } = useContext(NotesContext);
  const { auth } = useContext(AuthContext);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      notes.value.find((note: Note) => note.uuid === uuid)?.content === "" &&
      e.key === "Backspace" &&
      auth?.value?.userId
    ) {
      e.preventDefault();
      deleteNote(auth.value.userId, uuid);
    }
  };

  const handleInput = (e: Event) => {
    if (auth?.value?.userId) {
      const target = e.target as HTMLInputElement;
      const content = target.value;

      updateNote(auth.value.userId, uuid, content);
    }
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
