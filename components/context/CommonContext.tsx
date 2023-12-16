// Copyright 2023-Present Soma Notes
import { ComponentChild, createContext } from "preact";
import AuthState, { AuthStateType } from "../../signal/auth.ts";
import JournalsState, { JournalsStateType } from "../../signal/journals.ts";
import NotesState, { NotesStateType } from "../../signal/notes.ts";
import TasksState, { TasksStateType } from "../../signal/tasks.ts";
import UIState, { UIStateType } from "../../signal/ui.ts";

export const AuthContext = createContext<AuthStateType>({} as AuthStateType);
export const NotesContext = createContext<NotesStateType>({} as NotesStateType);
export const JournalsContext = createContext<JournalsStateType>(
  {} as JournalsStateType,
);
export const TasksContext = createContext<TasksStateType>({} as TasksStateType);
export const UIContext = createContext<UIStateType>({} as UIStateType);

type CommonContextProps = {
  children: ComponentChild;
};

const CommonContext = ({ children }: CommonContextProps) => {
  return (
    <AuthContext.Provider value={AuthState}>
      <NotesContext.Provider value={NotesState}>
        <JournalsContext.Provider value={JournalsState}>
          <TasksContext.Provider value={TasksState}>
            <UIContext.Provider value={UIState}>{children}</UIContext.Provider>
          </TasksContext.Provider>
        </JournalsContext.Provider>
      </NotesContext.Provider>
    </AuthContext.Provider>
  );
};

export default CommonContext;
