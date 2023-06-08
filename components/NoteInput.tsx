import { useContext } from "preact/hooks";
import { NotesState } from "../signal/context.tsx";

interface NoteInputProps {
  value: string;
}

const NoteInput = (props: NoteInputProps) => {
  const { createNote } = useContext(NotesState);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      createNote(null);
    }
  };

  return (
    <input
      class="border-2 border-gray-400 rounded-md w-full"
      placeholder="New note"
      type="text"
      value={props.value}
      onKeyDown={handleKeyDown}
    />
  );
};

export default NoteInput;
