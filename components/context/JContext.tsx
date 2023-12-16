// Copyright 2023-Present Soma Notes
import { ComponentChild } from "preact";
import AuthState from "../../signal/auth.ts";
import JournalsState from "../../signal/journals.ts";
import UIState from "../../signal/ui.ts";
import { AuthContext, JournalsContext, UIContext } from "./CommonContext.tsx";

type JContextProps = {
  children: ComponentChild;
};

const JContext = ({ children }: JContextProps) => {
  return (
    <AuthContext.Provider value={AuthState}>
      <JournalsContext.Provider value={JournalsState}>
        <UIContext.Provider value={UIState}>{children}</UIContext.Provider>
      </JournalsContext.Provider>
    </AuthContext.Provider>
  );
};

export default JContext;
