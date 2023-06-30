import { useContext, useEffect, useState } from "preact/hooks";
import { AuthContext, NotesContext } from "./Context.tsx";
import NoteInput from "./NoteInput.tsx";
import AnchorButton from "./AnchorButton.tsx";
import { findDescendantNotes } from "../helpers/notes.ts";

interface NoteViewerProps {
  params: Record<string, string>;
}

const NoteViewer = ({ params }: NoteViewerProps) => {
  const { auth } = useContext(AuthContext);
  const { notes, setNoteFocused } = useContext(NotesContext);

  const note = notes.value.find((n) => n.uuid === params.note);
  if (!note) return null;

  const parentNoteHref = note?.parent ? `/notes/${note.parent}` : "/notes";

  const [notesFocused, setNotesFocused] = useState(true);
  const handleFocusNotesButtonClick = () => {
    const descendants = findDescendantNotes(note, notes.value);
    const newNotesFocused = descendants.every((n) => n.focused);

    descendants.forEach((n) =>
      setNoteFocused(auth.value.userId || "", n.uuid, !newNotesFocused)
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
          onClick={handleFocusNotesButtonClick}
          title={notesFocused ? "Unfocus all" : "Focus all"}
          roundedLeft
        />

        <AnchorButton
          href="/notes"
          title="Notes"
        />

        <AnchorButton
          href={parentNoteHref}
          title="Parent"
          roundedRight
        />
      </div>

      <div class="p-2.5 bg-gray-200 rounded-lg">
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
