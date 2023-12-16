// Copyright 2023-Present Soma Notes
import Toasts from "../components/Toasts.tsx";
import UserTasks from "../components/UserTasks.tsx";
import TContext from "../components/context/TContext.tsx";
import TContextSetup from "../components/context/TContextSetup.tsx";
import { UserDataResponse } from "../helpers/authentication-handler.ts";

type UserTasksIslandProps = {
  userData: UserDataResponse | undefined;
};

const UserTasksIsland = (
  { userData }: UserTasksIslandProps,
) => (
  <TContext>
    <TContextSetup userData={userData} />
    <Toasts />

    <UserTasks />
  </TContext>
);

export default UserTasksIsland;
