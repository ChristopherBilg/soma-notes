import { useContext } from "preact/hooks";
import { NotesState } from "../signal/context.tsx";

interface NoteInputProps {
  uuid: string;
}

const NoteInput = (props: NoteInputProps) => {
  const { notes, createNote, deleteNote, updateNote } = useContext(NotesState);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      notes.value.find((note) => note.uuid === props.uuid)?.content === "" &&
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
      value={notes.value.find((note) => note.uuid === props.uuid)?.content}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
    />
  );
};

export default NoteInput;
