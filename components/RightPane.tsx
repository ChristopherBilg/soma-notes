import { useContext } from "preact/hooks";
import { matchesSearch } from "../helpers/notes.ts";
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
    <div class="p-2.5 rounded-r-lg border-2" style={{ width }}>
      <div>
        <ul class="ml-4">
          {(notes.value as Note[])
            .filter((note) => matchesSearch(searchField.value, note.content))
            .filter((note) => note.parent === null)
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
