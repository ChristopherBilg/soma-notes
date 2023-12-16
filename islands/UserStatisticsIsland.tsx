// Copyright 2023-Present Soma Notes
import Toasts from "../components/Toasts.tsx";
import UserStatistics from "../components/UserStatistics.tsx";
import CommonContext from "../components/context/CommonContext.tsx";
import CommonContextSetup from "../components/context/CommonContextSetup.tsx";
import { UserDataResponse } from "../helpers/authentication-handler.ts";

type UserStatisticsIslandProps = {
  userData: UserDataResponse | undefined;
};

const UserStatisticsIsland = ({ userData }: UserStatisticsIslandProps) => (
  <CommonContext>
    <CommonContextSetup userData={userData} />
    <Toasts />

    <UserStatistics />
  </CommonContext>
);

export default UserStatisticsIsland;
