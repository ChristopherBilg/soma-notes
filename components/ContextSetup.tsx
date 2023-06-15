import { useContext } from "preact/hooks";
import { UserDataResponse } from "../helpers/github-auth.ts";
import { AuthContext } from "./Context.tsx";

interface ContextSetupProps {
  userData: UserDataResponse | undefined;
}

const ContextSetup = ({ userData }: ContextSetupProps) => {
  const { setAuth, clearAuth } = useContext(AuthContext);

  if (userData) setAuth(userData);
  else clearAuth();

  return null;
};

export default ContextSetup;
