import { Handlers } from "$fresh/server.ts";
import { authHandler } from "../helpers/auth-handler.ts";
import { UserDataResponse } from "../helpers/github-auth.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const response = await authHandler(req, ctx, await ctx.render());

    return response;
  },
};

interface LandingPageProps {
  data: { userData: UserDataResponse } | null;
}

const LandingPage = ({ data }: LandingPageProps) => (
  <div class="fixed inset-0 flex items-center justify-center">
    <div class="relative bg-white p-6 rounded-lg">
      <h1 class="text-3xl text-center mb-4">Soma Notes</h1>
      <hr class="mb-4" />
      <h2 class="text-center">Welcome {data?.userData.ok && "back "}to Soma Notes!</h2>
      <div class="flex justify-center m-4">
        {data?.userData.ok ? (
          <>
            <a href="/notes" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l">
              Notes
            </a>

            <a href="/api/logout" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r">
              Logout
            </a>
          </>
        ) : (
          <a href="/api/login" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Login with GitHub
          </a>
        )}
      </div>
    </div>
  </div>
);

export default LandingPage;
