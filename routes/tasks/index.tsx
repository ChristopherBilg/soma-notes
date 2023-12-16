// Copyright 2023-Present Soma Notes
import { Head } from "$fresh/runtime.ts";
import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import NavigationButtons from "../../components/NavigationButtons.tsx";
import {
  authenticationHandler,
  UserDataResponse,
} from "../../helpers/authentication-handler.ts";
import TasksViewerIsland from "../../islands/TasksViewerIsland.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const [response] = await authenticationHandler(
      req,
      ctx,
      new Response("Temporary redirect", {
        status: STATUS_CODE.TemporaryRedirect,
        headers: { Location: "/api/signin" },
      }),
    );

    return response;
  },
};

type TasksProps = {
  data: { userData: UserDataResponse } | null;
};

const Tasks = ({ data }: TasksProps) => (
  <>
    <Head>
      <title>Soma Notes | Tasks</title>
    </Head>

    <div class="p-4 mx-auto max-w-screen-xl">
      <h1 class="my-6 text-center">
        Logged in as{" "}
        <b>{data?.userData.user.provider}/{data?.userData.user.userName}</b>!
      </h1>

      <NavigationButtons primary="tasks" />

      <TasksViewerIsland userData={data?.userData} />
    </div>
  </>
);

export default Tasks;
