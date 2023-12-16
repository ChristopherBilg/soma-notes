// Copyright 2023-Present Soma Notes
import { debounce } from "$std/async/debounce.ts";
import { useContext } from "preact/hooks";
import { UI_UPDATE_DEBOUNCE_TIME_MILLIS } from "../helpers/constants.ts";
import { matchesSearch } from "../helpers/notes.ts";
import {
  debouncedAdjustNoteTextareaHeight,
  focusHTMLElement,
} from "../helpers/ui.ts";
import { useURLSearchParams } from "../hooks/use-url-search-params.tsx";
import { Note } from "../signal/notes.ts";
import AnchorButton from "./AnchorButton.tsx";
import CreateNoteButton from "./CreateNoteButton.tsx";
import { NotesContext } from "./context/CommonContext.tsx";

type LeftPaneProps = {
  width: string;
};

const LeftPane = ({ width }: LeftPaneProps) => {
  const { notes } = useContext(NotesContext);
  const { searchParams, updateSearchParams } = useURLSearchParams();

  const recentNotes = (notes.value as Note[])
    .filter((n) => matchesSearch(searchParams.get("s") || "", n.content))
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 10);
  const pinnedNotes = (notes.value as Note[])
    .filter((n) => matchesSearch(searchParams.get("s") || "", n.content))
    .filter((n) => n.pinned)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const debouncedSetSearchField = debounce(
    (value: string) => {
      updateSearchParams("s", value);
      focusHTMLElement("#notes-search-field");
    },
    UI_UPDATE_DEBOUNCE_TIME_MILLIS,
  );

  const handleSearchFieldInput = (e: Event) => {
    const target = e.target as HTMLInputElement;

    debouncedSetSearchField(target.value);
    debouncedAdjustNoteTextareaHeight();
  };

  const handleTodosButtonClick = () => {
    updateSearchParams("s", "TODO: ");
  };

  return (
    <div class={`p-2.5 rounded-l-lg border-2`} style={{ width }}>
      <div class="mb-4">
        <b>Pinned</b>
        {pinnedNotes.length > 0
          ? (
            <ul class="list-disc list-inside">
              {pinnedNotes.map((n) => (
                <li class="truncate">
                  <a
                    class="hover:underline break-words"
                    href={`/notes/${n.uuid}`}
                  >
                    {n.content}
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
              {recentNotes.map((n) => (
                <li class="truncate">
                  <a
                    class="hover:underline break-words"
                    href={`/notes/${n.uuid}`}
                  >
                    {n.content}
                  </a>
                </li>
              ))}
            </ul>
          )
          : <p>No recent notes</p>}
      </div>

      <b>Search</b>
      <input
        id="notes-search-field"
        class="border border-gray-300 rounded-md w-full px-2 py-1 mt-1 mb-4"
        placeholder="Search notes"
        type="search"
        value={searchParams.get("s") || undefined}
        onInput={handleSearchFieldInput}
        spellcheck={false}
      />

      <div class="flex justify-between">
        <CreateNoteButton />

        <AnchorButton
          title="To-Dos"
          onClick={handleTodosButtonClick}
          variant="primary"
          rounded
        />
      </div>
    </div>
  );
};

export default LeftPane;
