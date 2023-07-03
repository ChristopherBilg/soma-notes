// Copyright 2023 Soma Notes
import { useContext } from "preact/hooks";
import { Note } from "../signal/notes.ts";
import { NotesContext } from "./Context.tsx";

interface BreadCrumbsProps {
  note: Note | undefined;
  finalNote?: boolean;
}

const BreadCrumbs = ({ note, finalNote }: BreadCrumbsProps) => {
  const { notes } = useContext(NotesContext);

  return note
    ? (
      <div class="inline">
        <BreadCrumbs note={notes.value.find((n) => n.uuid === note.parent)} />
        <a
          class="hover:underline"
          href={`/notes/${notes.value.find((n) => n.uuid === note.uuid)?.uuid}`}
        >
          {`${note.content}`}
        </a>
        {finalNote ? "" : " / "}
      </div>
    )
    : (
      <div class="inline mx-1">
        <a class="hover:underline" href="/notes">
          <b>Some Notes</b>
        </a>
        {" /"}
      </div>
    );
};

export default BreadCrumbs;
