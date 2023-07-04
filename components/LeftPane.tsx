// Copyright 2023 Soma Notes
import { useContext } from "preact/hooks";
import { matchesSearch } from "../helpers/notes.ts";
import { Note } from "../signal/notes.ts";
import { NotesContext, UIContext } from "./Context.tsx";

type LeftPaneProps = {
  width: string;
};

const LeftPane = ({ width }: LeftPaneProps) => {
  const { notes } = useContext(NotesContext);
  const { searchField, setSearchField } = useContext(UIContext);

  const recentNotes = (notes.value as Note[])
    .filter((note) => matchesSearch(searchField.value, note.content))
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 20);
  const pinnedNotes = (notes.value as Note[])
    .filter((note) => matchesSearch(searchField.value, note.content))
    .filter((note) => note.pinned)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div class="p-2.5 rounded-l-lg border-2" style={{ width }}>
      <div class="mb-4">
        <b>Pinned</b>
        {pinnedNotes.length > 0
          ? (
            <ul class="list-disc list-inside">
              {pinnedNotes.map((note) => (
                <li>
                  <a
                    class={note.completed ? "line-through" : ""}
                    href={`/notes/${note.uuid}`}
                  >
                    {note.content}
                  </a>
                </li>
              ))}
            </ul>
          )
          : <p>No pinned notes</p>}
      </div>

      <div class="mb-4">
        <b>Recently Modified</b>
        {recentNotes.length > 0
          ? (
            <ul class="list-disc list-inside">
              {recentNotes.map((note) => (
                <li>
                  <a
                    class={note.completed ? "line-through" : ""}
                    href={`/notes/${note.uuid}`}
                  >
                    {note.content}
                  </a>
                </li>
              ))}
            </ul>
          )
          : <p>No recent notes</p>}
      </div>

      <b>Search</b>
      <input
        class="border-2 border-gray-400 rounded-md w-full"
        placeholder="Search notes"
        type="text"
        value={searchField.value}
        onInput={(e) => setSearchField((e.target as HTMLInputElement).value)}
      />
    </div>
  );
};

export default LeftPane;
