// Copyright 2023-Present Soma Notes
import Toasts from "../components/Toasts.tsx";
import UserSettings from "../components/UserSettings.tsx";
import CommonContext from "../components/context/CommonContext.tsx";
import CommonContextSetup from "../components/context/CommonContextSetup.tsx";
import { UserDataResponse } from "../helpers/authentication-handler.ts";

type UserSettingsIslandProps = {
  userData: UserDataResponse | undefined;
};

const UserSettingsIsland = ({ userData }: UserSettingsIslandProps) => (
  <CommonContext>
    <CommonContextSetup userData={userData} />
    <Toasts />

    <UserSettings />
  </CommonContext>
);

export default UserSettingsIsland;
