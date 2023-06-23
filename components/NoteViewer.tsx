import { useContext } from "preact/hooks";
import { AuthContext, NotesContext } from "./Context.tsx";
import NoteInput from "./NoteInput.tsx";

interface NoteViewerProps {
  params: Record<string, string>;
}

const NoteViewer = ({ params }: NoteViewerProps) => {
  const { auth } = useContext(AuthContext);
  const { notes, updateNote } = useContext(NotesContext);

  const note = notes.value.find((n) => n.uuid === params.note);
  if (!note) return null;

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
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleNotePinButtonClick}
        >
          {note.pinned ? "Unpin" : "Pin"}
        </button>
        
        <a href={`/notes/${note.parent}`} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Parent
        </a>
      </div>

      <div class="p-2.5 bg-gray-200 rounded-lg">
        <div>
          <ul class="list-disc ml-4">
            <li>
              <NoteInput uuid={note.uuid} />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NoteViewer;
