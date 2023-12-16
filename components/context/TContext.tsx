// Copyright 2023-Present Soma Notes
import { ComponentChild } from "preact";
import AuthState from "../../signal/auth.ts";
import TasksState from "../../signal/tasks.ts";
import UIState from "../../signal/ui.ts";
import { AuthContext, TasksContext, UIContext } from "./CommonContext.tsx";

type TContextProps = {
  children: ComponentChild;
};

const TContext = ({ children }: TContextProps) => {
  return (
    <AuthContext.Provider value={AuthState}>
      <TasksContext.Provider value={TasksState}>
        <UIContext.Provider value={UIState}>{children}</UIContext.Provider>
      </TasksContext.Provider>
    </AuthContext.Provider>
  );
};

export default TContext;
