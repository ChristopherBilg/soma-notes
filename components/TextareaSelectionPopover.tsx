// Copyright 2023-Present Soma Notes
import { useContext } from "preact/hooks";
import { findBestMatch } from "string-similarity";
import { UUID } from "../signal/common.ts";
import AnchorButton from "./AnchorButton.tsx";
import Tooltip from "./Tooltip.tsx";
import { AuthContext, NotesContext } from "./context/CommonContext.tsx";

type TextareaSelectionPopoverProps = {
  selectedText: string;
  offsetTop: number;
  offsetLeft: number;
  uuid: UUID;
};

const TextareaSelectionPopover = (
  { selectedText, offsetTop, offsetLeft, uuid }: TextareaSelectionPopoverProps,
) => {
  const { auth } = useContext(AuthContext);
  const { notes, updateNote } = useContext(NotesContext);

  const note = notes.value.find((n) => n.uuid === uuid);

  const relatedNotes = findBestMatch(
    selectedText,
    notes.value.map((n) => n.content),
  )
    .ratings
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10)
    .map((r) => ({
      rating: r.rating,
      note: notes.value.find((n) => n.content === r.target),
    }))
    .filter((o) => o.note?.uuid !== uuid);

  return (
    <div
      id="selected-text-popover"
      class={`absolute z-10 my-8 p-2 bg-white border border-gray-300 rounded shadow-md`}
      style={{
        top: `${offsetTop}px`,
        left: `${offsetLeft}px`,
      }}
    >
      <div class="flex justify-between">
        <div class="font-bold my-auto mr-2">
          Notes related to "{selectedText}":
        </div>

        <div class="flex">
          <Tooltip text="Link">
            <AnchorButton
              title="L"
              href={`/notes/${uuid}`}
              roundedLeft
              minimal
              lighter
            />
          </Tooltip>

          <Tooltip text="Pin">
            <AnchorButton
              title="P"
              onClick={() =>
                updateNote(auth.value, uuid, { pinned: !note?.pinned })}
              minimal
              lighter
            />
          </Tooltip>

          <Tooltip text="Emphasize">
            <AnchorButton
              title="E"
              onClick={() =>
                updateNote(auth.value, uuid, { emphasized: !note?.emphasized })}
              minimal
              lighter
            />
          </Tooltip>

          <Tooltip text="Complete">
            <AnchorButton
              title="C"
              onClick={() =>
                updateNote(auth.value, uuid, { completed: !note?.completed })}
              roundedRight
              minimal
              lighter
            />
          </Tooltip>
        </div>
      </div>

      {relatedNotes.length === 0
        ? <div class="text-gray-500">No related notes.</div>
        : (
          relatedNotes.map((n) => (
            <div class="flex justify-between max-w-xl">
              <a
                href={`/notes/${n.note?.uuid}`}
                class="hover:underline truncate mr-2 my-auto"
              >
                <span
                  class={`
                    font-mono
                    ${n.rating > 0.8 ? "text-green-500" : ""}
                    ${
                    n.rating > 0.5 && n.rating <= 0.8 ? "text-yellow-500" : ""
                  }
                    ${n.rating <= 0.5 ? "text-red-500" : ""}
                  `}
                >
                  {n.rating.toFixed(3)}
                </span>{" "}
                {n.note?.content}
              </a>

              <Tooltip text="Hard link">
                <AnchorButton
                  title="H"
                  onClick={() => {
                    // Update the hard links for both notes
                    updateNote(auth.value, uuid, {
                      hardLinks: note?.hardLinks.includes(n.note?.uuid!)
                        ? note?.hardLinks.filter((h) => h !== n.note?.uuid)
                        : [...note?.hardLinks || [], n.note?.uuid!],
                    });

                    updateNote(auth.value, n.note?.uuid!, {
                      hardLinks: n.note?.hardLinks.includes(uuid)
                        ? n.note?.hardLinks.filter((h) => h !== uuid)
                        : [...n.note?.hardLinks || [], uuid],
                    });
                  }}
                  minimal
                  lighter
                />
              </Tooltip>
            </div>
          ))
        )}
    </div>
  );
};

export default TextareaSelectionPopover;
