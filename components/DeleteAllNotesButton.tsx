import { useContext } from "preact/hooks";
import { AuthContext, NotesContext } from "./Context.tsx";
import AnchorButton from "./AnchorButton.tsx";

const DeleteAllNotesButton = () => {
  const { auth } = useContext(AuthContext);
  const { deleteAllNotes } = useContext(NotesContext);

  const handleDeleteAllNotesButtonClick = () => {
    if (auth?.value.userId) deleteAllNotes(auth.value.userId);
  };

  return (
    <AnchorButton
      onClick={handleDeleteAllNotesButtonClick}
      title="Delete All Notes [-]"
    />
  );
};

export default DeleteAllNotesButton;
