import { Note } from "../helpers/notes.ts";

interface LeftPaneProps {
  width: string;
  notes: Note[];
}

export function LeftPane(props: LeftPaneProps) {
  const recentNotes = props.notes
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 20);
  const pinnedNotes = props.notes.filter((note) => note.pinned);

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
}
