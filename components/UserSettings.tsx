import { useContext } from "preact/hooks";
import { AuthContext, NotesContext } from "./Context.tsx";
import { exportNotes, importNotes } from "../helpers/import-export-notes.ts";

const UserSettings = () => {
  const { auth } = useContext(AuthContext);
  const { notes, setNotes } = useContext(NotesContext);

  const handleImportNotesButtonClick = () =>
    importNotes((newNotes) => setNotes(auth.value.userId || "", newNotes));

  const handleOverwriteNotesButtonClick = () =>
    importNotes((newNotes) => setNotes(auth.value.userId || "", newNotes));

  const handleExportNotesButtonClick = () => exportNotes(notes.value);

  return (
    <div class="flex flex-col justify-center items-center">
      <h1 class="text-2xl font-bold">User Settings</h1>
      <div class="flex flex-col justify-center items-center">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-4 rounded"
          onClick={handleImportNotesButtonClick}
        >
          Import Notes From JSON file
        </button>

        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-4 rounded"
          onClick={handleExportNotesButtonClick}
        >
          Export Notes To JSON file
        </button>
      </div>
    </div>
  );
};

export default UserSettings;
