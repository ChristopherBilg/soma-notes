// Copyright 2023-Present Soma Notes
import { Head } from "$fresh/runtime.ts";
import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import NavigationButtons from "../../../components/NavigationButtons.tsx";
import {
  authenticationHandler,
  UserDataResponse,
} from "../../../helpers/authentication-handler.ts";
import UserStatisticsIsland from "../../../islands/UserStatisticsIsland.tsx";

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

type UserStatisticsProps = {
  data: { userData: UserDataResponse } | null;
};

const UserStatistics = ({ data }: UserStatisticsProps) => (
  <>
    <Head>
      <title>Soma Notes | User Statistics</title>
    </Head>

    <div class="p-4 mx-auto max-w-screen-xl">
      <h1 class="my-6 text-center">
        Logged in as{" "}
        <b>{data?.userData.user.provider}/{data?.userData.user.userName}</b>!
      </h1>

      <NavigationButtons primary="statistics" />

      <UserStatisticsIsland userData={data?.userData} />
    </div>
  </>
);

export default UserStatistics;
