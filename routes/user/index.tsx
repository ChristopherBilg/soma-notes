import { Handlers } from "$fresh/server.ts";
import { authHandler } from "../../helpers/auth-handler.ts";
import { UserDataResponse } from "../../helpers/github-auth.ts";

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
    <h1 class="my-6 text-center">
      Soma Notes: User Settings
    </h1>

    <h1 class="my-6 text-center bold">
      {data?.userData.userName}
    </h1>

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

    { /* TODO: Add note importing */ }
    { /* TODO: Add note exporting */ }
  </div>
);

export default User;
