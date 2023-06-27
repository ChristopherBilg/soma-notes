import { useContext } from "preact/hooks";
import { AuthContext, NotesContext } from "./Context.tsx";
import NoteInput from "./NoteInput.tsx";
import AnchorButton from "./AnchorButton.tsx";

interface NoteViewerProps {
  params: Record<string, string>;
}

const NoteViewer = ({ params }: NoteViewerProps) => {
  const { auth } = useContext(AuthContext);
  const { notes, updateNote } = useContext(NotesContext);

  const note = notes.value.find((n) => n.uuid === params.note);
  if (!note) return null;

  const parentNoteHref = note?.parent ? `/notes/${note.parent}` : "/notes";

  const handleNotePinButtonClick = () =>
    updateNote(
      auth?.value.userId || "",
      note.uuid,
      note.content,
      note.pinned ? false : true,
    );

  return (
    <div class="p-4 mx-auto max-w-screen-lg">
      <div class="flex justify-evenly m-4">
        <AnchorButton
          onClick={handleNotePinButtonClick}
          title={note.pinned ? "Unpin" : "Pin"}
          rounded
        />

        <AnchorButton
          href="/notes"
          title="Notes"
          rounded
        />

        <AnchorButton
          href={parentNoteHref}
          title="Parent"
          rounded
        />
      </div>

      <div class="p-2.5 bg-gray-200 rounded-lg">
        <div>
          <ul class="list-disc ml-4">
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
