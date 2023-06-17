import { useContext } from "preact/hooks";
import { NotesContext } from "./Context.tsx";

interface NoteViewProps {
  params: Record<string, string>;
}

const NoteView = ({ params }: NoteViewProps) => {
  const { notes } = useContext(NotesContext);
  const note = notes.value.find((n) => n.uuid === params.note);

  return (
    <>
      <div>UUID: {note?.uuid}</div>
      <div>
        Parent: {note?.parent ? <a href={`/notes/${note.parent}`}></a> : "No"}
      </div>
      <div>Pinned: {note?.pinned ? "Yes" : "No"}</div>
      <div>Content: {note?.content}</div>
    </>
  );
};

export default NoteView;
