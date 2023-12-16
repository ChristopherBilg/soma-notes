// Copyright 2023-Present Soma Notes
import { useContext } from "preact/hooks";
import { matchesSearch } from "../helpers/notes.ts";
import { useURLSearchParams } from "../hooks/use-url-search-params.tsx";
import { Note } from "../signal/notes.ts";
import NoteTextarea from "./NoteTextarea.tsx";
import { NotesContext } from "./context/CommonContext.tsx";

const RightPane = () => {
  const { notes } = useContext(NotesContext);
  const { searchParams } = useURLSearchParams();

  return (
    <div class="p-2.5 rounded-r-lg border-2" style={{ width: "inherit" }}>
      <div>
        <ul class="ml-4">
          {!searchParams.get("s")
            ? (notes.value as Note[])
              .filter((n) => n.parent === null)
              .sort((a, b) => a.order - b.order)
              .reverse()
              .slice(0, 10)
              .reverse()
              .map((n) => (
                <li>
                  <NoteTextarea uuid={n.uuid} recursion />
                </li>
              ))
            : (notes.value as Note[])
              .filter((n) =>
                matchesSearch(searchParams.get("s") || "", n.content)
              )
              .sort((a, b) => a.order - b.order)
              .reverse()
              .slice(0, 30)
              .reverse()
              .map((n) => (
                <li>
                  <NoteTextarea uuid={n.uuid} />
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
};

export default RightPane;
