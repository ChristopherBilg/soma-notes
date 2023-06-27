import { useContext } from "preact/hooks";
import { AuthContext, NotesContext } from "./Context.tsx";
import { exportNotes, importNotes } from "../helpers/import-export-notes.ts";
import AnchorButton from "./AnchorButton.tsx";

const UserSettings = () => {
  const { auth } = useContext(AuthContext);
  const { notes, setNotes } = useContext(NotesContext);

  const handleImportNotesButtonClick = () =>
    importNotes((newNotes) => setNotes(auth.value.userId || "", newNotes));

  const handleExportNotesButtonClick = () => exportNotes(notes.value);

  return (
    <div class="flex flex-col justify-center items-center">
      <h1 class="text-2xl font-bold">User Settings</h1>

      <br />

      <div class="flex flex-col justify-center items-center">
        <AnchorButton
          onClick={handleImportNotesButtonClick}
          title="Import Notes From JSON file"
          rounded
        />

        <br />

        <AnchorButton
          onClick={handleExportNotesButtonClick}
          title="Export Notes To JSON file"
          rounded
        />
      </div>
    </div>
  );
};

export default UserSettings;
