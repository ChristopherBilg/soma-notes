import { ComponentChild, createContext } from "preact";
import AuthState, { AuthStateType } from "../signal/auth.ts";
import NotesState, { NotesStateType } from "../signal/notes.ts";

export const AuthContext = createContext<AuthStateType>({} as AuthStateType);
export const NotesContext = createContext<NotesStateType>({} as NotesStateType);

interface ContextProps {
  children: ComponentChild;
}

const Context = ({ children }: ContextProps) => {
  return (
    <AuthContext.Provider value={AuthState}>
      <NotesContext.Provider value={NotesState}>
        {children}
      </NotesContext.Provider>
    </AuthContext.Provider>
  );
};

export default Context;
