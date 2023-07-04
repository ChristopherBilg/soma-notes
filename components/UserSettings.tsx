// Copyright 2023 Soma Notes
import { useContext } from "preact/hooks";
import { AuthContext, NotesContext } from "./Context.tsx";
import { exportNotes, importNotes } from "../helpers/notes.ts";
import AnchorButton from "./AnchorButton.tsx";

const UserSettings = () => {
  const { auth } = useContext(AuthContext);
  const { notes, setNotes } = useContext(NotesContext);

  const handleImportNotesButtonClick = () =>
    importNotes((newNotes) => setNotes(auth.value, newNotes));

  const handleExportNotesButtonClick = () => exportNotes(notes.value);

  return (
    <div class="flex flex-col justify-center items-center">
      <h1 class="text-2xl font-bold mb-4">User Settings</h1>

      <div class="flex flex-col justify-center items-center gap-6">
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
      </div>
    </div>
  );
};

export default UserSettings;
