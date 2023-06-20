import { ComponentChild, createContext } from "preact";
import AuthState, { AuthStateType } from "../signal/auth.ts";
import NotesState, { NotesStateType } from "../signal/notes.ts";
import UIState, { UIStateType } from "../signal/ui.ts";

export const AuthContext = createContext<AuthStateType>({} as AuthStateType);
export const NotesContext = createContext<NotesStateType>({} as NotesStateType);
export const UIContext = createContext<UIStateType>({} as UIStateType);

interface ContextProps {
  children: ComponentChild;
}

const Context = ({ children }: ContextProps) => {
  return (
    <AuthContext.Provider value={AuthState}>
      <NotesContext.Provider value={NotesState}>
        <UIContext.Provider value={UIState}>
          {children}
        </UIContext.Provider>
      </NotesContext.Provider>
    </AuthContext.Provider>
  );
};

export default Context;
