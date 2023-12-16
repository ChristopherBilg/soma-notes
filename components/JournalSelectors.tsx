// Copyright 2023-Present Soma Notes
import { debounce } from "$std/async/debounce.ts";
import { useEffect } from "preact/hooks";
import { UI_UPDATE_DEBOUNCE_TIME_MILLIS } from "../helpers/constants.ts";
import {
  getDateFromFormattedDay,
  getFormattedDay,
  getFormattedDayDiff,
} from "../helpers/date.ts";
import { focusHTMLElement } from "../helpers/ui.ts";
import { useURLSearchParams } from "../hooks/use-url-search-params.tsx";
import AnchorButton from "./AnchorButton.tsx";

const JournalSelectors = () => {
  const { searchParams, updateSearchParams } = useURLSearchParams();

  useEffect(() => {
    if (searchParams.has("d")) return;

    const formattedToday = getFormattedDay(new Date());

    updateSearchParams("d", formattedToday);
  }, []);

  const handleDateChange = (event: Event) => {
    const target = event.target as HTMLInputElement;

    updateSearchParams("d", target.value);
  };

  const handleDateButtonClick = (dayDiff: number) => () => {
    const currentJournalDate = getDateFromFormattedDay(searchParams.get("d")!);
    const newJournalDate = getFormattedDayDiff(currentJournalDate, dayDiff);

    updateSearchParams("d", newJournalDate);
  };

  const debouncedSetSearchField = debounce(
    (value: string) => {
      updateSearchParams("s", value);
      focusHTMLElement("#notes-search-field");
    },
    UI_UPDATE_DEBOUNCE_TIME_MILLIS,
  );

  const handleSearchFieldInput = (event: Event) => {
    const target = event.target as HTMLInputElement;

    debouncedSetSearchField(target.value);
  };

  return (
    <div class="flex justify-between w-full max-w-screen-xl px-4">
      <div class="flex">
        <div class="my-auto mr-4">
          <AnchorButton
            title="<"
            onClick={handleDateButtonClick(-1)}
            roundedLeft
            lighter
          />
        </div>

        <input
          type="date"
          class="border border-gray-300 rounded-md px-2 py-1"
          value={searchParams.get("d")!}
          onChange={handleDateChange}
        />

        <div class="my-auto ml-4">
          <AnchorButton
            title=">"
            onClick={handleDateButtonClick(1)}
            roundedRight
            lighter
          />
        </div>
      </div>

      <input
        id="journal-search-field"
        class="border border-gray-300 rounded-md px-2 py-1 my-auto"
        placeholder="Search journals"
        type="search"
        value={searchParams.get("s") || undefined}
        onInput={handleSearchFieldInput}
        spellcheck={false}
      />
    </div>
  );
};

export default JournalSelectors;
