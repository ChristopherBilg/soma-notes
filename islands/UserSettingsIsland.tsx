// Copyright 2023 Soma Notes
import Context from "../components/Context.tsx";
import ContextSetup from "../components/ContextSetup.tsx";
import UserSettings from "../components/UserSettings.tsx";
import { UserDataResponse } from "../helpers/auth/index.ts";

type UserSettingsIslandProps = {
  userData: UserDataResponse | undefined;
};

const UserSettingsIsland = ({ userData }: UserSettingsIslandProps) => (
  <Context>
    <ContextSetup userData={userData} />

    <UserSettings />
  </Context>
);

export default UserSettingsIsland;
