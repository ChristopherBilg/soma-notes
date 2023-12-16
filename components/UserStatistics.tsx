// Copyright 2023-Present Soma Notes
import { ChartDataset } from "chart-js/auto/auto.d.ts";
import { useContext } from "preact/hooks";
import CreatedPerMonthChart from "./CreatedPerMonthChart.tsx";
import NetworkRequestLoadingIcon from "./NetworkRequestLoadingIcon.tsx";
import { JournalsContext, NotesContext } from "./context/CommonContext.tsx";

// deno-lint-ignore no-explicit-any
const getDatasets = (data: any[], key: string) => {
  const datasets: ChartDataset[] = [];

  data.forEach((d) => {
    const date = new Date(d[key]);
    const month = date.getMonth();
    const year = date.getFullYear();
    const label = `${year}`;
    const dataset = datasets.find((dataset) => dataset.label === label);

    if (dataset) {
      dataset.data[month] = Number(dataset.data[month]) + 1;
    } else {
      datasets.push({
        label,
        data: Array(12).fill(0).map((_, index) => {
          return index === month ? 1 : 0;
        }),
      });
    }
  });

  return datasets;
};

const UserStatistics = () => {
  const { notes, notesNetworkRequestPending } = useContext(NotesContext);
  const { journals, journalsNetworkRequestPending } = useContext(
    JournalsContext,
  );

  const convertedJournalDates = journals.value.map((journal) => {
    const year = Number(journal.date.substring(0, 4));
    const month = Number(journal.date.substring(5, 7)) - 1;
    const day = Number(journal.date.substring(8, 10));

    return {
      date: new Date(year, month, day),
    };
  });

  const noteDatasets = getDatasets(notes.value, "createdAt");
  const journalDatasets = getDatasets(convertedJournalDates, "date");

  return (
    <div class="flex flex-col justify-center items-center">
      <NetworkRequestLoadingIcon
        hidden={!notesNetworkRequestPending.value &&
          !journalsNetworkRequestPending.value}
      />

      <h1 class="text-2xl font-bold mb-4">User Statistics</h1>

      <div
        class="flex flex-col justify-center items-center gap-6 w-9/12"
        style={{ minWidth: "300px" }}
      >
        <hr class="w-full" />

        <h2 class="text-xl font-bold">Notes</h2>

        <p class="text-lg">
          Total notes: {notes.value.length}
        </p>

        <hr class="w-full" />

        <h2 class="text-xl font-bold">Notes Created / Month</h2>

        <CreatedPerMonthChart datasets={noteDatasets} />

        <hr class="w-full" />

        <h2 class="text-xl font-bold">Journals</h2>

        <p class="text-lg">
          Total journal entries: {journals.value.length}
        </p>

        <hr class="w-full" />

        <h2 class="text-xl font-bold">Journal Entries / Month</h2>

        <CreatedPerMonthChart datasets={journalDatasets} />
      </div>
    </div>
  );
};

export default UserStatistics;
