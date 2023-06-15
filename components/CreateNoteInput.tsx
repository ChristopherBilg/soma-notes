import { useContext } from "preact/hooks";
import { NotesContext } from "./Context.tsx";

const CreateNoteInput = () => {
  const { createNote } = useContext(NotesContext);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const uuid = createNote(null, "");

      setTimeout(() => {
        const input = document.querySelector(
          `input[data-uuid="${uuid}"]`,
        ) as HTMLInputElement;
        input.focus();
      }, 0);
    }
  };

  const handleInput = (e: Event) => {};

  return (
    <input
      class="border-2 border-gray-400 rounded-md w-full"
      placeholder="New note"
      type="text"
      onKeyDown={handleKeyDown}
      onInput={handleInput}
    />
  );
};

export default CreateNoteInput;
