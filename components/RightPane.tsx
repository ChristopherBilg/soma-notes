import { useContext } from "preact/hooks";
import { NotesState } from "../signal/context.tsx";
import CreateNoteInput from "./CreateNoteInput.tsx";
import NoteInput from "./NoteInput.tsx";

interface RightPaneProps {
  width: string;
}

const RightPane = (props: RightPaneProps) => {
  const { notes } = useContext(NotesState);

  return (
    <div
      class="p-2.5 bg-gray-200 rounded-r-lg"
      style={{ width: props.width }}
    >
      <div>
        <ul class="list-disc ml-4">
          {notes.value
            .sort((a, b) => a.createdAt - b.createdAt)
            .map((note) => (
              <li>
                <NoteInput uuid={note.uuid} />
              </li>
            ))}
          <li>
            <CreateNoteInput />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RightPane;
