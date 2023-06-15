import { ComponentChild } from "preact";
import { useContext } from "preact/hooks";
import { UserDataResponse } from "../helpers/github-auth.ts";
import { AuthContext, NotesContext } from "./Context.tsx";

interface ContextSetupProps {
  children: ComponentChild;
  userData: UserDataResponse | undefined;
}

const ContextSetup = ({ children, userData }: ContextSetupProps) => {
  const { setAuth, clearAuth } = useContext(AuthContext);

  if (userData) setAuth(userData);
  else clearAuth();

  const { loadNotes } = useContext(NotesContext);
  if (userData) loadNotes(userData.userId);

  return (
    <>
      {children}
    </>
  );
};

export default ContextSetup;
