// Copyright 2023-Present Soma Notes
import { useContext, useEffect } from "preact/hooks";
import { UserDataResponse } from "../../helpers/authentication-handler.ts";
import { AuthContext, JournalsContext, UIContext } from "./CommonContext.tsx";

type JContextSetupProps = {
  userData: UserDataResponse | undefined;
};

const JContextSetup = ({ userData }: JContextSetupProps) => {
  const { setAuth, clearAuth } = useContext(AuthContext);
  const { setupJournals } = useContext(JournalsContext);
  const { loadUIState, addToast } = useContext(UIContext);

  // AuthContext
  useEffect(() => {
    if (userData?.user) setAuth(userData.user);
    else clearAuth();
  }, [userData]);

  // JournalsContext
  useEffect(() => {
    if (userData?.user) {
      setupJournals(
        userData.user,
        () => addToast("Failed to load journals."),
        () => addToast("Failed to save journals."),
      );
    }
  }, [userData]);

  // UIContext
  useEffect(() => {
    loadUIState();
  }, []);

  return null;
};

export default JContextSetup;
