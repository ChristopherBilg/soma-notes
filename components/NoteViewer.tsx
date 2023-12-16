// Copyright 2023-Present Soma Notes
import { useContext, useEffect } from "preact/hooks";
import { focusHTMLElement } from "../helpers/ui.ts";
import BreadCrumbs from "./BreadCrumbs.tsx";
import NetworkRequestLoadingIcon from "./NetworkRequestLoadingIcon.tsx";
import NoteTextarea from "./NoteTextarea.tsx";
import { NotesContext } from "./context/CommonContext.tsx";

type NoteViewerProps = {
  params: Record<string, string>;
};

const NoteViewer = ({ params }: NoteViewerProps) => {
  const { notes, notesNetworkRequestPending } = useContext(NotesContext);

  const note = notes.value.find((n) => n.uuid === params.noteId);
  if (!note) return null;

  useEffect(() => {
    focusHTMLElement(`textarea[data-uuid="${note.uuid}"]`);
  }, []);

  return (
    <div class="p-4 mx-auto max-w-screen-xl">
      <NetworkRequestLoadingIcon hidden={!notesNetworkRequestPending.value} />

      <div class="flex justify-center m-4">
        <BreadCrumbs
          note={notes.value.find((n) => n.uuid === note.parent)}
        />
      </div>

      <div class="p-2.5 rounded-lg border-2">
        <ul class="ml-4">
          <li>
            <NoteTextarea uuid={note.uuid} isIndividualNoteView recursion />
          </li>
        </ul>
      </div>

      <div class="flex flex-col m-2">
        <p class="text-sm text-gray-500">
          Created: {new Date(note.createdAt).toLocaleString()}
        </p>

        <p class="text-sm text-gray-500">
          Last Updated: {new Date(note.updatedAt).toLocaleString()}
        </p>

        <p class="text-sm text-gray-500">
          Overall Order: {note.order}
        </p>
      </div>
    </div>
  );
};

export default NoteViewer;
