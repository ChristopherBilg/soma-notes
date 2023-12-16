// Copyright 2023-Present Soma Notes
import { useContext, useEffect } from "preact/hooks";
import { UserDataResponse } from "../../helpers/authentication-handler.ts";
import { AuthContext, TasksContext, UIContext } from "./CommonContext.tsx";

type TContextSetupProps = {
  userData: UserDataResponse | undefined;
};

const TContextSetup = ({ userData }: TContextSetupProps) => {
  const { setAuth, clearAuth } = useContext(AuthContext);
  const { setupTasks } = useContext(TasksContext);
  const { loadUIState, addToast } = useContext(UIContext);

  // AuthContext
  useEffect(() => {
    if (userData?.user) setAuth(userData.user);
    else clearAuth();
  }, [userData]);

  // TasksContext
  useEffect(() => {
    if (userData?.user) {
      setupTasks(
        userData.user,
        () => addToast("Failed to load tasks."),
        () => addToast("Failed to save tasks."),
      );
    }
  }, [userData]);

  // UIContext
  useEffect(() => {
    loadUIState();
  }, []);

  return null;
};

export default TContextSetup;
