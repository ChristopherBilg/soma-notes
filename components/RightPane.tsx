import { Note } from "../helpers/notes.ts";
import { NoteInput } from "./NoteInput.tsx";

interface RightPaneProps {
  width: string;
  notes: Note[];
}

export function RightPane(props: RightPaneProps) {
  return (
    <div
      class="p-2.5 bg-gray-200 rounded-r-lg"
      style={{ width: props.width }}
    >
      <div>
        <ul class="list-disc ml-4">
          {props.notes.map((note) => (
            <li>
              <NoteInput value={note.content} onInput={() => {}} />
            </li>
          ))}
          <li>
            <NoteInput value="" onInput={() => {}} />
          </li>
        </ul>
      </div>
    </div>
  );
}
