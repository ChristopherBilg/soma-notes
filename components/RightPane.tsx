import { useContext } from "preact/hooks";
import { NotesContext } from "../signal/context.tsx";
import { Note } from "../signal/notes.ts";
import CreateNoteInput from "./CreateNoteInput.tsx";
import NoteInput from "./NoteInput.tsx";

interface RightPaneProps {
  width: string;
}

const RightPane = (props: RightPaneProps) => {
  const { notes } = useContext(NotesContext);

  return (
    <div
      class="p-2.5 bg-gray-200 rounded-r-lg"
      style={{ width: props.width }}
    >
      <div>
        <ul class="list-disc ml-4">
          {(notes.value as Note[])
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
