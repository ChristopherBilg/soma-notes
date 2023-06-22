import { useContext } from "preact/hooks";
import { matchesSearch } from "../helpers/search.ts";
import { Note } from "../signal/notes.ts";
import { NotesContext, UIContext } from "./Context.tsx";
import NoteInput from "./NoteInput.tsx";

interface RightPaneProps {
  width: string;
}

const RightPane = ({ width }: RightPaneProps) => {
  const { notes } = useContext(NotesContext);
  const { searchField } = useContext(UIContext);

  return (
    <div class="p-2.5 bg-gray-200 rounded-r-lg" style={{ width }}>
      <div>
        <ul class="list-disc ml-4">
          {(notes.value as Note[])
            .filter((note) => matchesSearch(searchField.value, note.content))
            .sort((a, b) => a.createdAt - b.createdAt)
            .map((note) => (
              <li>
                <NoteInput uuid={note.uuid} />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default RightPane;
