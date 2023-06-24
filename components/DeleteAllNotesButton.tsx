import { useContext } from "preact/hooks";
import { AuthContext, NotesContext } from "./Context.tsx";

const DeleteAllNotesButton = () => {
  const { auth } = useContext(AuthContext);
  const { deleteAllNotes } = useContext(NotesContext);

  const handleDeleteAllNotesButtonClick = () => {
    if (auth?.value.userId) deleteAllNotes(auth.value.userId);
  };

  return (
    <button
      class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleDeleteAllNotesButtonClick}
    >
      Delete All Notes [-]
    </button>
  );
};

export default DeleteAllNotesButton;
