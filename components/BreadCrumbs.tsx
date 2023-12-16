// Copyright 2023-Present Soma Notes
import { useContext } from "preact/hooks";
import { Note } from "../signal/notes.ts";
import { NotesContext } from "./context/CommonContext.tsx";

type BreadCrumbsProps = {
  note: Note | undefined;
};

const BreadCrumbs = ({ note }: BreadCrumbsProps) => {
  const { notes } = useContext(NotesContext);

  return note
    ? (
      <div class="inline truncate">
        <BreadCrumbs note={notes.value.find((n) => n.uuid === note.parent)} />
        <a
          class="hover:underline"
          href={`/notes/${notes.value.find((n) => n.uuid === note.uuid)?.uuid}`}
        >
          {`${note.content}`}
        </a>
        {" / "}
      </div>
    )
    : (
      <div class="inline truncate mx-1">
        <a class="hover:underline" href="/notes">
          <b>Soma Notes</b>
        </a>
        {" /"}
      </div>
    );
};

export default BreadCrumbs;
