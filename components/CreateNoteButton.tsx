// Copyright 2023 Soma Notes
import { useContext } from "preact/hooks";
import { AuthContext, NotesContext } from "./Context.tsx";
import AnchorButton from "./AnchorButton.tsx";

const CreateNoteButton = () => {
  const { auth } = useContext(AuthContext);
  const { createNote } = useContext(NotesContext);

  const handleCreateNoteButtonClick = () => {
    if (auth?.value.userId) createNote(auth.value, null, "");
  };

  return (
    <AnchorButton
      onClick={handleCreateNoteButtonClick}
      title="Create Note [+]"
      roundedRight
    />
  );
};

export default CreateNoteButton;
