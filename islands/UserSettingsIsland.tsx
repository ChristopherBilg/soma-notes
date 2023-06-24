import Context from "../components/Context.tsx";
import ContextSetup from "../components/ContextSetup.tsx";
import UserSettings from "../components/UserSettings.tsx";
import { UserDataResponse } from "../helpers/github-auth.ts";

interface UserSettingsIslandProps {
  userData: UserDataResponse | undefined;
}

const UserSettingsIsland = ({ userData }: UserSettingsIslandProps) => (
  <Context>
    <ContextSetup userData={userData} />

    <UserSettings />
  </Context>
);

export default UserSettingsIsland;
