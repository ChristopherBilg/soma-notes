import { useContext } from "preact/hooks";
import { NotesState } from "../signal/context.tsx";

interface LeftPaneProps {
  width: string;
}

const LeftPane = (props: LeftPaneProps) => {
  const { notes } = useContext(NotesState);

  const recentNotes = notes.value
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 20);
  const pinnedNotes = notes.value.filter((note) => note.pinned);

  return (
    <div
      class="p-2.5 bg-gray-300 rounded-l-lg"
      style={{ width: props.width }}
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
