// Copyright 2023 Soma Notes
import { useContext, useEffect, useState } from "preact/hooks";
import { AuthContext, NotesContext } from "./Context.tsx";
import NoteInput from "./NoteInput.tsx";
import AnchorButton from "./AnchorButton.tsx";
import { findDescendantNotes } from "../helpers/notes.ts";
import BreadCrumbs from "./BreadCrumbs.tsx";

type NoteViewerProps = {
  params: Record<string, string>;
};

const NoteViewer = ({ params }: NoteViewerProps) => {
  const { auth } = useContext(AuthContext);
  const { notes, setNoteFocused, updateNote } = useContext(NotesContext);

  const note = notes.value.find((n) => n.uuid === params.note);
  if (!note) return null;

  const handlePinNoteButtonClick = () => {
    updateNote(
      auth.value,
      note.uuid,
      {
        pinned: !note.pinned,
      },
    );
  };

  const handleCompleteNoteButtonClick = () => {
    updateNote(
      auth.value,
      note.uuid,
      {
        completed: !note.completed,
      },
    );
  };

  const [notesFocused, setNotesFocused] = useState(true);
  const handleFocusNotesButtonClick = () => {
    const descendants = findDescendantNotes(note, notes.value);
    const newNotesFocused = descendants.every((n) => n.focused);

    descendants.forEach((n) =>
      setNoteFocused(auth.value, n.uuid, !newNotesFocused)
    );
    setNotesFocused(!newNotesFocused);
  };

  useEffect(() => {
    const descendants = findDescendantNotes(note, notes.value);
    const newNotesFocused = descendants.every((n) => n.focused);
    setNotesFocused(newNotesFocused);
  }, []);

  return (
    <div class="p-4 mx-auto max-w-screen-xlg">
      <div class="flex justify-center m-4">
        <AnchorButton
          onClick={handlePinNoteButtonClick}
          title={note.pinned ? "Unpin" : "Pin"}
          roundedLeft
        />

        <AnchorButton
          onClick={handleCompleteNoteButtonClick}
          title={note.completed ? "Uncomplete" : "Complete"}
        />

        <AnchorButton
          onClick={handleFocusNotesButtonClick}
          title={notesFocused ? "Unfocus all" : "Focus all"}
          roundedRight
        />
      </div>

      <div class="flex justify-center m-4">
        <p class="truncate">
          <BreadCrumbs
            note={notes.value.find((n) => n.uuid === note.parent)}
            finalNote
          />
        </p>
      </div>

      <div class="p-2.5 rounded-lg border-2">
        <div>
          <ul class="ml-4">
            <li>
              <NoteInput uuid={note.uuid} isIndividualNoteView />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NoteViewer;
