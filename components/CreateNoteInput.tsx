import { useContext } from "preact/hooks";
import { AuthContext, NotesContext } from "./Context.tsx";

const CreateNoteInput = () => {
  const { createNote } = useContext(NotesContext);
  const { auth } = useContext(AuthContext);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && auth?.value?.userId) {
      e.preventDefault();
      const uuid = createNote(auth.value.userId, null, "");

      setTimeout(() => {
        const input = document.querySelector(`input[data-uuid="${uuid}"]`) as HTMLInputElement;
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
