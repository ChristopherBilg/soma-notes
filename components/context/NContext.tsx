// Copyright 2023-Present Soma Notes
import { ComponentChild } from "preact";
import AuthState from "../../signal/auth.ts";
import NotesState from "../../signal/notes.ts";
import UIState from "../../signal/ui.ts";
import { AuthContext, NotesContext, UIContext } from "./CommonContext.tsx";

type NContextProps = {
  children: ComponentChild;
};

const NContext = ({ children }: NContextProps) => {
  return (
    <AuthContext.Provider value={AuthState}>
      <NotesContext.Provider value={NotesState}>
        <UIContext.Provider value={UIState}>{children}</UIContext.Provider>
      </NotesContext.Provider>
    </AuthContext.Provider>
  );
};

export default NContext;
