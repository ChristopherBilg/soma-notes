import { Handlers } from "$fresh/server.ts";
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
      <a
        href="/api/logout"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </a>

      <a
        href="/notes"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Notes
      </a>
    </div>

    <UserSettingsIsland userData={data?.userData} />
  </div>
);

export default User;
