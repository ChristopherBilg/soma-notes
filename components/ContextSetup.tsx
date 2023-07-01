// Copyright 2023 Soma Notes
import { useContext, useEffect } from "preact/hooks";
import { UserDataResponse } from "../helpers/github-auth.ts";
import { AuthContext, NotesContext } from "./Context.tsx";

interface ContextSetupProps {
  userData: UserDataResponse | undefined;
}

const ContextSetup = ({ userData }: ContextSetupProps) => {
  const { setAuth, clearAuth } = useContext(AuthContext);

  if (userData) setAuth(userData);
  else clearAuth();

  const { loadNotes } = useContext(NotesContext);
  useEffect(() => {
    if (userData?.userId) loadNotes(userData.userId);
  }, [userData]);

  return null;
};

export default ContextSetup;
