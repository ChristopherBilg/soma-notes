import { ComponentChild, createContext } from "preact";
import AuthState, { AuthStateType } from "./auth.ts";
import NotesState, { NotesStateType } from "./notes.ts";

export const AuthContext = createContext<AuthStateType>({} as AuthStateType);
export const NotesContext = createContext<NotesStateType>({} as NotesStateType);

const Context = ({ children }: { children: ComponentChild }) => {
  return (
    <AuthContext.Provider value={AuthState}>
      <NotesContext.Provider value={NotesState}>
        {children}
      </NotesContext.Provider>
    </AuthContext.Provider>
  );
};

export default Context;
