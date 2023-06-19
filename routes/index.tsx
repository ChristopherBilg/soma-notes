import { Handlers } from "$fresh/server.ts";
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

interface LandingPageProps {
  data: { userData: UserDataResponse } | null;
}

const LandingPage = ({ data }: LandingPageProps) => {
  return (
    <>
      {data?.userData?.ok
        ? (
          <div class="fixed inset-0 flex items-center justify-center">
            <div class="relative bg-white p-6 rounded-lg">
              <h1 class="text-center">Welcome back to Soma Notes!</h1>
              <div class="flex justify-center m-2">
                <a
                  href="/notes"
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l"
                >
                  Notes
                </a>

                <a
                  href="/api/logout"
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
                >
                  Logout
                </a>
              </div>
            </div>
          </div>
        )
        : (
          <div class="fixed inset-0 flex items-center justify-center">
            <div class="relative bg-white p-6 rounded-lg">
              <h1 class="text-center">Welcome to Soma Notes!</h1>
              <div class="flex justify-center m-2">
                <a
                  href="/api/login"
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Signup/Login
                </a>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default LandingPage;
