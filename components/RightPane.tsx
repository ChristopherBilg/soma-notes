interface RightPaneProps {
  width: string;
  noteIds: string[];
}

export function RightPane(props: RightPaneProps) {
  return (
    <div
      class="p-2.5 bg-gray-200 rounded-r-lg"
      style={{ width: props.width }}
    >
      <div>
        <ul style={{ listStyleType: "circle", listStylePosition: "inside" }}>
          {props.noteIds.map((noteId) => (
            <li>
              <a href={`/notes/${noteId}`}>{noteId}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
