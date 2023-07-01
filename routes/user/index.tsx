// Copyright 2023 Soma Notes
import { Handlers } from "$fresh/server.ts";
import AnchorButton from "../../components/AnchorButton.tsx";
import { authHandler } from "../../helpers/auth-handler.ts";
import { UserDataResponse } from "../../helpers/github-auth.ts";
import UserSettingsIsland from "../../islands/UserSettingsIsland.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const [response] = await authHandler(
      req,
      ctx,
      new Response("", {
        status: 307,
        headers: { Location: "/api/login" },
      }),
    );

    return response;
  },
};

interface UserProps {
  data: { userData: UserDataResponse } | null;
}

const User = ({ data }: UserProps) => (
  <div class="p-4 mx-auto max-w-screen-xlg">
    <div class="flex justify-evenly m-4">
      <AnchorButton
        href="/api/logout"
        title="Logout"
        rounded
      />

      <AnchorButton
        href="/notes"
        title="Notes"
        rounded
      />
    </div>

    <UserSettingsIsland userData={data?.userData} />
  </div>
);

export default User;
