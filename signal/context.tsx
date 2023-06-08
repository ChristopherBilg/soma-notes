import { ComponentChild, createContext } from "preact";
import state, { NotesStateType } from "./notes.ts";

export const NotesState = createContext<NotesStateType>({} as NotesStateType);

const NotesStateContext = ({ children }: { children: ComponentChild }) => {
  return (
    <NotesState.Provider value={state}>
      {children}
    </NotesState.Provider>
  );
};

export default NotesStateContext;
