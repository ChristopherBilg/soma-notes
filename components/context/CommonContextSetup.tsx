// Copyright 2023-Present Soma Notes
import { useContext, useEffect } from "preact/hooks";
import { UserDataResponse } from "../../helpers/authentication-handler.ts";
import {
  AuthContext,
  JournalsContext,
  NotesContext,
  TasksContext,
  UIContext,
} from "./CommonContext.tsx";

type CommonContextSetupProps = {
  userData: UserDataResponse | undefined;
};

const CommonContextSetup = ({ userData }: CommonContextSetupProps) => {
  const { setAuth, clearAuth } = useContext(AuthContext);
  const { setupNotes } = useContext(NotesContext);
  const { setupJournals } = useContext(JournalsContext);
  const { setupTasks } = useContext(TasksContext);
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

  // JournalsContext
  useEffect(() => {
    if (userData?.user) {
      setupJournals(
        userData.user,
        () => addToast("Failed to load journals."),
        () => addToast("Failed to save journals."),
      );
    }
  }, [userData]);

  // TasksContext
  useEffect(() => {
    if (userData?.user) {
      setupTasks(
        userData.user,
        () => addToast("Failed to load tasks."),
        () => addToast("Failed to save tasks."),
      );
    }
  }, [userData]);

  // UIContext
  useEffect(() => {
    loadUIState();
  }, []);

  return null;
};

export default CommonContextSetup;
