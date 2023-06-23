import { useContext } from "preact/hooks";
import { matchesSearch } from "../helpers/search.ts";
import { Note } from "../signal/notes.ts";
import { AuthContext, NotesContext, UIContext } from "./Context.tsx";

interface NoteInputProps {
  uuid: string;
}

const NoteInput = ({ uuid }: NoteInputProps) => {
  const { notes, createNote, deleteNote, updateNote } = useContext(
    NotesContext,
  );
  const { auth } = useContext(AuthContext);
  const { searchField } = useContext(UIContext);

  const note = notes.value.find((note: Note) => note.uuid === uuid);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!auth?.value?.userId) return;
    if (!note) return;

    if (e.key === "Backspace") {
      if (note.content !== "") return;

      e.preventDefault();

      // Update all parent UUID of all child notes to be the parent of the deleted note
      const parentUUID = note.parent;
      notes.value
        .filter((n: Note) => n.parent === uuid)
        .forEach((n: Note) => {
          updateNote(
            auth.value.userId || "",
            n.uuid,
            n.content,
            undefined,
            parentUUID,
          );
        });

      deleteNote(auth.value.userId, uuid);
    }

    if (e.key === "Enter") {
      e.preventDefault();

      createNote(auth.value.userId, note.parent, "");
    }
  };

  const handleInput = (e: Event) => {
    if (!auth?.value?.userId) return;

    const target = e.target as HTMLInputElement;
    const content = target.value;

    updateNote(auth.value.userId, uuid, content);
  };

  return (
    <>
      <input
        class="border-none bg-transparent rounded-md w-full"
        placeholder="Add a note"
        type="text"
        data-uuid={uuid}
        value={note?.content}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
      />

      <ul class="list-disc ml-4">
        {(notes.value as Note[])
          .filter((note) => matchesSearch(searchField.value, note.content))
          .filter((childNote) => childNote.parent === uuid)
          .sort((a, b) => a.createdAt - b.createdAt)
          .map((childNote) => (
            <li>
              <NoteInput uuid={childNote.uuid} />
            </li>
          ))}
      </ul>
    </>
  );
};

export default NoteInput;
