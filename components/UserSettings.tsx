// Copyright 2023-Present Soma Notes
import { useContext } from "preact/hooks";
import { exportJournals, importJournals } from "../helpers/journals.ts";
import { exportNotes, importNotes } from "../helpers/notes.ts";
import { exportTasks, importTasks } from "../helpers/tasks.ts";
import { uppercaseFirstLetter } from "../helpers/text-manipulation.ts";
import { Subscription } from "../signal/auth.ts";
import AnchorButton from "./AnchorButton.tsx";
import NetworkRequestLoadingIcon from "./NetworkRequestLoadingIcon.tsx";
import {
  AuthContext,
  JournalsContext,
  NotesContext,
  TasksContext,
  UIContext,
} from "./context/CommonContext.tsx";

const UserSettings = () => {
  const { auth } = useContext(AuthContext);
  const {
    notes,
    setNotes,
    deleteAllNotes,
    updateNote,
    notesNetworkRequestPending,
  } = useContext(NotesContext);
  const {
    journals,
    setJournals,
    deleteAllJournals,
    journalsNetworkRequestPending,
  } = useContext(JournalsContext);
  const { tasks, setTasks, deleteAllTasks, tasksNetworkRequestPending } =
    useContext(
      TasksContext,
    );
  const { addToast } = useContext(UIContext);

  const handleImportNotesButtonClick = () =>
    importNotes((newNotes) => {
      setNotes(auth.value, newNotes);
      addToast("Notes imported successfully.");
    }, () => addToast("Failed to import notes."));

  const handleExportNotesButtonClick = () => {
    exportNotes(notes.value);

    addToast("Notes exported successfully.");
  };

  const handleFixNoteOrderButtonClick = () => {
    notes.value
      .sort((a, b) => a.order - b.order)
      .forEach((n, index) => {
        n.order = index + 1;

        updateNote(
          auth.value,
          n.uuid,
          {
            order: n.order,
          },
        );
      });

    addToast("Note order fixed.");
  };

  const handleDeleteAllNotesButtonClick = () => {
    addToast("Are you sure you want to delete all notes?", {
      callback: () => {
        deleteAllNotes(auth.value);
        addToast("All notes deleted.");
      },
    });
  };

  const handleImportJournalsButtonClick = () =>
    importJournals((newJournals) => {
      setJournals(auth.value, newJournals);
      addToast("Journals imported successfully.");
    }, () => addToast("Failed to import journals."));

  const handleExportJournalsButtonClick = () => {
    exportJournals(journals.value);

    addToast("Journals exported successfully.");
  };

  const handleDeleteAllJournalsButtonClick = () => {
    addToast("Are you sure you want to delete all journals?", {
      callback: () => {
        deleteAllJournals(auth.value);
        addToast("All journals deleted.");
      },
    });
  };

  const handleImportTasksButtonClick = () =>
    importTasks((newTasks) => {
      setTasks(auth.value, newTasks);
      addToast("Tasks imported successfully.");
    }, () => addToast("Failed to import tasks."));

  const handleExportTasksButtonClick = () => {
    exportTasks(tasks.value);

    addToast("Tasks exported successfully.");
  };

  const handleDeleteAllTasksButtonClick = () => {
    addToast("Are you sure you want to delete all tasks?", {
      callback: () => {
        deleteAllTasks(auth.value);
        addToast("All tasks deleted.");
      },
    });
  };

  return (
    <div class="flex flex-col justify-center items-center">
      <NetworkRequestLoadingIcon
        hidden={!notesNetworkRequestPending.value &&
          !journalsNetworkRequestPending.value &&
          !tasksNetworkRequestPending.value}
      />

      <h1 class="text-2xl font-bold mb-4">User Settings</h1>

      <div class="flex flex-col justify-center items-center gap-6">
        {auth.value.avatarUrl
          ? (
            <img
              class="rounded-full w-32 h-32"
              src={auth.value.avatarUrl}
              alt="User Avatar"
            />
          )
          : <div class="w-32 h-32 rounded-full bg-gray-200" />}

        <hr class="w-full" />

        <h2 class="text-xl font-bold">Subscription Tier</h2>

        {Object.values(Subscription).map((value) => (
          <p class="text-lg">
            {value === auth.value.subscription
              ? (
                <b>
                  {uppercaseFirstLetter(value)}
                </b>
              )
              : (
                uppercaseFirstLetter(value)
              )}
          </p>
        ))}

        <hr class="w-full" />

        <h2 class="text-xl font-bold">Notes</h2>

        <AnchorButton
          onClick={handleImportNotesButtonClick}
          title="Import Notes From JSON file"
          rounded
        />

        <AnchorButton
          onClick={handleExportNotesButtonClick}
          title="Export Notes To JSON file"
          rounded
        />

        <AnchorButton
          onClick={handleFixNoteOrderButtonClick}
          title="Fix Note Order"
          rounded
        />

        <AnchorButton
          onClick={handleDeleteAllNotesButtonClick}
          title="Delete All Notes [-]"
          rounded
          variant="danger"
        />

        <hr class="w-full" />

        <h2 class="text-xl font-bold">Journals</h2>

        <AnchorButton
          onClick={handleImportJournalsButtonClick}
          title="Import Journals From JSON file"
          rounded
        />

        <AnchorButton
          onClick={handleExportJournalsButtonClick}
          title="Export Journals To JSON file"
          rounded
        />

        <AnchorButton
          onClick={handleDeleteAllJournalsButtonClick}
          title="Delete All Journals [-]"
          rounded
          variant="danger"
        />

        <hr class="w-full" />

        <h2 class="text-xl font-bold">Tasks</h2>

        <AnchorButton
          onClick={handleImportTasksButtonClick}
          title="Import Tasks From JSON file"
          rounded
        />

        <AnchorButton
          onClick={handleExportTasksButtonClick}
          title="Export Tasks To JSON file"
          rounded
        />

        <AnchorButton
          onClick={handleDeleteAllTasksButtonClick}
          title="Delete All Tasks [-]"
          rounded
          variant="danger"
        />
      </div>
    </div>
  );
};

export default UserSettings;
