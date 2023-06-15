import { Handlers, PageProps } from "$fresh/server.ts";
import { authHandler } from "../helpers/auth-handler.ts";
import { UserDataResponse } from "../helpers/github-auth.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const response = await authHandler(
      req,
      ctx,
      await ctx.render(),
    );

    return response;
  },
};

const LandingPage = (
  { data }: PageProps<{ userData: UserDataResponse }>,
) => {
  return (
    <div class="p-4 mx-auto max-w-screen-xlg">
      <h1 class="my-6 text-center">
        Welcome to{" "}
        <b>Soma Notes</b>, a simple, global, low-latency note keeping
        application. You are {data?.userData?.userName || "not logged in"}!
      </h1>

      {data?.userData?.userId && (
        <h2 class="my-6 text-center">
          <a href="/notes">Notes</a>
        </h2>
      )}

      <h2 class="my-6 text-center">
        {data?.userData?.userId
          ? <a href="/api/logout">Logout</a>
          : <a href="/api/login">Login</a>}
      </h2>
    </div>
  );
};

export default LandingPage;
