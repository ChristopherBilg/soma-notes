import { useContext } from "preact/hooks";
import { AuthContext, NotesContext } from "./Context.tsx";

const CreateNoteButton = () => {
  const { auth } = useContext(AuthContext);
  const { createNote } = useContext(NotesContext);

  const handleCreateNoteButtonClick = () =>
    createNote(auth?.value?.userId, null, "");

  return (
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleCreateNoteButtonClick}
    >
      Create Note [+]
    </button>
  );
};

export default CreateNoteButton;
