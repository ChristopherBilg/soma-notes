// Copyright 2023-Present Soma Notes
import { useContext, useEffect, useState } from "preact/hooks";
import {
  getDateFromFormattedDay,
  getFormattedDay,
  getHumanReadableDayDiff,
} from "../helpers/date.ts";
import { matchesSearch } from "../helpers/notes.ts";
import { debouncedAdjustJournalTextareaHeight } from "../helpers/ui.ts";
import { useURLSearchParams } from "../hooks/use-url-search-params.tsx";
import { getMaxJournalLength, Journal } from "../signal/journals.ts";
import AnchorButton from "./AnchorButton.tsx";
import NetworkRequestLoadingIcon from "./NetworkRequestLoadingIcon.tsx";
import {
  AuthContext,
  JournalsContext,
  UIContext,
} from "./context/CommonContext.tsx";

const JournalViewer = () => {
  const { auth } = useContext(AuthContext);
  const {
    journals,
    createJournal,
    deleteJournal,
    updateJournal,
    journalsNetworkRequestPending,
  } = useContext(JournalsContext);
  const { addToast } = useContext(UIContext);
  const { searchParams } = useURLSearchParams();

  const [selectedJournal, setSelectedJournal] = useState<Journal>();
  useEffect(() => {
    const date = searchParams.get("d") || getFormattedDay(new Date());
    const journal = journals.value.find((journal) => journal.date === date);

    setSelectedJournal(journal);
    debouncedAdjustJournalTextareaHeight();
  }, [searchParams, journals.value]);

  const handleInput = (e: Event) => {
    if (!auth?.value?.userId) return;

    const target = e.target as HTMLTextAreaElement;
    let content = target.value;

    const maxJournalContentLength = getMaxJournalLength(
      auth.value.subscription,
    );
    if (content.length >= maxJournalContentLength) {
      addToast(
        `Journal content is too long, max length is ${maxJournalContentLength} characters`,
      );
      content = content.substring(0, maxJournalContentLength);
    }

    updateJournal(auth.value, selectedJournal?.date!, { content });
    debouncedAdjustJournalTextareaHeight();
  };

  const handleCreateJournalButtonClick = () => {
    createJournal(auth.value, searchParams.get("d")!);
  };

  const handleDeleteJournalButtonClick = () => {
    addToast("Are you sure you want to delete this journal entry?", {
      callback: () => {
        deleteJournal(auth.value, selectedJournal?.date!);
        addToast("Journal entry deleted.");
      },
    });
  };

  if (searchParams.get("s")) {
    return (
      <div class="p-4 my-2 mx-auto w-full max-w-screen-xl">
        <NetworkRequestLoadingIcon
          hidden={!journalsNetworkRequestPending.value}
        />

        <div class="flex justify-between">
          <h1 class="text-2xl font-bold my-auto">
            Search Results for "{searchParams.get("s")}"
          </h1>
        </div>

        <div class="flex flex-col m-2">
          <p class="text-sm text-gray-500">
            {journals.value.filter((journal) =>
              matchesSearch(searchParams.get("s")!, journal.content)
            ).length} out of {journals.value.length}{" "}
            journals matched your search.
          </p>

          <p class="text-sm text-gray-500">
            {journals.value.filter((journal) =>
                  matchesSearch(searchParams.get("s")!, journal.content)
                ).length === 0 &&
              "Try searching for something else."}
          </p>
        </div>

        {journals.value.map((journal) => {
          if (!journal.content) return;

          if (!matchesSearch(searchParams.get("s")!, journal.content)) return;

          return (
            <div class="flex flex-col m-2">
              <AnchorButton
                title={journal.date}
                href={`/journals?d=${journal.date}`}
                rounded
                minimal
                variant="primary"
              />

              <code class="text-sm text-gray-500 mt-2">
                {journal.content.substring(0, 100)}
                {journal.content.length > 100 && "..."}
              </code>
            </div>
          );
        })}
      </div>
    );
  }

  return selectedJournal
    ? (
      <div class="p-4 my-2 mx-auto w-full max-w-screen-xl">
        <NetworkRequestLoadingIcon
          hidden={!journalsNetworkRequestPending.value}
        />

        <div class="flex justify-between">
          <h1 class="text-2xl font-bold my-auto">
            {getDateFromFormattedDay(selectedJournal.date).toDateString()}
            {getHumanReadableDayDiff(selectedJournal.date)}
          </h1>

          <div class="flex flex-col my-2 ml-2">
            <AnchorButton
              title="Delete Journal Entry [-]"
              onClick={handleDeleteJournalButtonClick}
              rounded
              variant="danger"
            />
          </div>
        </div>

        <div class="p-2.5 rounded-lg border-2">
          <textarea
            id="journal-content"
            class="border-none bg-transparent rounded-md w-full my-auto p-1 resize-none font-mono h-8"
            placeholder="Write your journal entry here..."
            type="text"
            value={selectedJournal.content}
            onInput={handleInput}
            spellcheck={false}
          />
        </div>

        <div class="flex flex-col m-2">
          <p class="text-sm text-gray-500">
            Created: {new Date(selectedJournal.createdAt).toLocaleString()}
          </p>

          <p class="text-sm text-gray-500">
            Last Updated: {new Date(selectedJournal.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    )
    : (
      <div class="p-4 my-2 mx-auto w-full max-w-screen-xl">
        <NetworkRequestLoadingIcon
          hidden={!journalsNetworkRequestPending.value}
        />

        <div class="p-2.5 rounded-lg border-2 text-center">
          <p class="mb-2">No Journal Selected or Found</p>

          <AnchorButton
            title={`Create a journal entry for ${searchParams.get("d")}`}
            onClick={handleCreateJournalButtonClick}
            rounded
          />
        </div>
      </div>
    );
};

export default JournalViewer;
