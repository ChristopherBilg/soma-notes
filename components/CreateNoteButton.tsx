// Copyright 2023-Present Soma Notes
import { useContext } from "preact/hooks";
import {
  debouncedAdjustNoteTextareaHeight,
  focusHTMLElement,
} from "../helpers/ui.ts";
import AnchorButton from "./AnchorButton.tsx";
import {
  AuthContext,
  NotesContext,
  UIContext,
} from "./context/CommonContext.tsx";

const CreateNoteButton = () => {
  const { auth } = useContext(AuthContext);
  const { createNote } = useContext(NotesContext);
  const { addToast } = useContext(UIContext);

  const handleCreateNoteButtonClick = () => {
    const newNoteUUID = createNote(auth.value, null);
    if (!newNoteUUID) {
      addToast("You have reached the maximum number of notes.");
      return;
    }

    debouncedAdjustNoteTextareaHeight();

    focusHTMLElement(`textarea[data-uuid="${newNoteUUID}"]`);
  };

  return (
    <AnchorButton
      onClick={handleCreateNoteButtonClick}
      title="Create Note [+]"
      rounded
      variant="success"
    />
  );
};

export default CreateNoteButton;
