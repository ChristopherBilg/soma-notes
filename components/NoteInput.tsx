import { useContext } from "preact/hooks";
import { NotesContext } from "../signal/context.tsx";
import { Note } from "../signal/notes.ts";

interface NoteInputProps {
  uuid: string;
}

const NoteInput = (props: NoteInputProps) => {
  const { notes, deleteNote, updateNote } = useContext(NotesContext);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      notes.value.find((note: Note) => note.uuid === props.uuid)?.content ===
        "" &&
      e.key === "Backspace"
    ) {
      e.preventDefault();
      deleteNote(props.uuid);
    }
  };

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const content = target.value;

    updateNote(props.uuid, content);
  };

  return (
    <input
      class="border-none bg-transparent rounded-md w-full"
      placeholder="Add a note"
      type="text"
      data-uuid={props.uuid}
      value={notes.value.find((note: Note) => note.uuid === props.uuid)
        ?.content}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
    />
  );
};

export default NoteInput;
