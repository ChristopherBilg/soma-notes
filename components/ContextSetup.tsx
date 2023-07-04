// Copyright 2023 Soma Notes
import { useContext, useEffect } from "preact/hooks";
import { UserDataResponse } from "../helpers/auth/index.ts";
import { AuthContext, NotesContext } from "./Context.tsx";

interface ContextSetupProps {
  userData: UserDataResponse | undefined;
}

const ContextSetup = ({ userData }: ContextSetupProps) => {
  const { user } = userData || {};
  const { setAuth, clearAuth } = useContext(AuthContext);

  if (user) setAuth(user);
  else clearAuth();

  const { loadNotes } = useContext(NotesContext);
  useEffect(() => {
    if (user?.userId) loadNotes(user);
  }, [userData]);

  return null;
};

export default ContextSetup;
