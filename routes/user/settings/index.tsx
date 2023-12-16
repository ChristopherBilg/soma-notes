// Copyright 2023-Present Soma Notes
import { Head } from "$fresh/runtime.ts";
import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import NavigationButtons from "../../../components/NavigationButtons.tsx";
import {
  authenticationHandler,
  UserDataResponse,
} from "../../../helpers/authentication-handler.ts";
import UserSettingsIsland from "../../../islands/UserSettingsIsland.tsx";

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

type UserSettingsProps = {
  data: { userData: UserDataResponse } | null;
};

const UserSettings = ({ data }: UserSettingsProps) => (
  <>
    <Head>
      <title>Soma Notes | User Settings</title>
    </Head>

    <div class="p-4 mx-auto max-w-screen-xl">
      <h1 class="my-6 text-center">
        Logged in as{" "}
        <b>{data?.userData.user.provider}/{data?.userData.user.userName}</b>!
      </h1>

      <NavigationButtons primary="settings" />

      <UserSettingsIsland userData={data?.userData} />
    </div>
  </>
);

export default UserSettings;
