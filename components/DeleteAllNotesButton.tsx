import { useContext } from "preact/hooks";
import { AuthContext, NotesContext } from "./Context.tsx";

const DeleteAllNotesButton = () => {
  const { auth } = useContext(AuthContext);
  const { deleteAllNotes } = useContext(NotesContext);

  const handleDeleteAllNotesButtonClick = () =>
    deleteAllNotes(auth.value?.userId);

  return (
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleDeleteAllNotesButtonClick}
    >
      Delete All Notes [-]
    </button>
  );
};

export default DeleteAllNotesButton;
