import { useContext } from "preact/hooks";
import { NotesContext } from "../islands/Context.tsx";
import { Note } from "../signal/notes.ts";

interface LeftPaneProps {
  width: string;
}

const LeftPane = ({ width }: LeftPaneProps) => {
  const { notes } = useContext(NotesContext);

  const recentNotes = (notes.value as Note[])
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 20);
  const pinnedNotes = (notes.value as Note[]).filter((note) => note.pinned);

  return (
    <div
      class="p-2.5 bg-gray-300 rounded-l-lg"
      style={{ width }}
    >
      <b>History</b>
      {recentNotes.length > 0
        ? (
          <ul class="list-disc list-inside">
            {recentNotes.map((
              note,
            ) => (
              <li>
                <a href={`/notes/${note.uuid}`}>{note.content}</a>
              </li>
            ))}
          </ul>
        )
        : <p>No recent notes</p>}

      <br />

      <b>Pinned</b>
      {pinnedNotes.length > 0
        ? (
          <ul class="list-disc list-inside">
            {pinnedNotes.map((note) => (
              <li>
                <a href={`/notes/${note.uuid}`}>{note.content}</a>
              </li>
            ))}
          </ul>
        )
        : <p>No pinned notes</p>}
    </div>
  );
};

export default LeftPane;
