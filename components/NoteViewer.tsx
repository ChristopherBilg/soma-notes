import { useContext } from "preact/hooks";
import { NotesContext } from "./Context.tsx";
import NoteInput from "./NoteInput.tsx";

interface NoteViewerProps {
  params: Record<string, string>;
}

const NoteViewer = ({ params }: NoteViewerProps) => {
  const { notes } = useContext(NotesContext);
  const note = notes.value.find((n) => n.uuid === params.note);
  if (!note) return null;

  return (
    <div class="p-4 mx-auto max-w-screen-lg">
      <div class="p-2.5 bg-gray-200 rounded-r-lg">
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
