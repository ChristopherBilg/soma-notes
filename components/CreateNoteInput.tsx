import { useContext } from "preact/hooks";
import { NotesState } from "../signal/context.tsx";

const CreateNoteInput = () => {
  const { createNote } = useContext(NotesState);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const uuid = createNote(null, "");

      // Set the cursor focus to the newly created note input with the given uuid
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
