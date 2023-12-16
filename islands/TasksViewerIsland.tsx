// Copyright 2023-Present Soma Notes
import TasksViewer from "../components/TasksViewer.tsx";
import TContext from "../components/context/TContext.tsx";
import TContextSetup from "../components/context/TContextSetup.tsx";
import { UserDataResponse } from "../helpers/authentication-handler.ts";

type TasksViewerIslandProps = {
  userData: UserDataResponse | undefined;
};

const TasksViewerIsland = (
  { userData }: TasksViewerIslandProps,
) => (
  <TContext>
    <TContextSetup userData={userData} />

    <TasksViewer />
  </TContext>
);

export default TasksViewerIsland;
