// Copyright 2023-Present Soma Notes
import { useContext, useEffect } from "preact/hooks";
import { UserDataResponse } from "../../helpers/authentication-handler.ts";
import { AuthContext, NotesContext, UIContext } from "./CommonContext.tsx";

type NContextSetupProps = {
  userData: UserDataResponse | undefined;
};

const NContextSetup = ({ userData }: NContextSetupProps) => {
  const { setAuth, clearAuth } = useContext(AuthContext);
  const { setupNotes } = useContext(NotesContext);
  const { loadUIState, addToast } = useContext(UIContext);

  // AuthContext
  useEffect(() => {
    if (userData?.user) setAuth(userData.user);
    else clearAuth();
  }, [userData]);

  // NotesContext
  useEffect(() => {
    if (userData?.user) {
      setupNotes(
        userData.user,
        () => addToast("Failed to load notes."),
        () => addToast("Failed to save notes."),
      );
    }
  }, [userData]);

  // UIContext
  useEffect(() => {
    loadUIState();
  }, []);

  return null;
};

export default NContextSetup;
