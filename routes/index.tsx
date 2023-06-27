import { Handlers } from "$fresh/server.ts";
import { authHandler } from "../helpers/auth-handler.ts";
import { UserDataResponse } from "../helpers/github-auth.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const [response] = await authHandler(req, ctx, await ctx.render());

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
      <h2 class="text-center">
        Welcome {data?.userData.ok && "back "}to Soma Notes!
      </h2>
      <div class="flex justify-center m-4">
        {data?.userData.ok
          ? (
            <>
              <a
                href="/notes"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l"
              >
                Notes
              </a>

              <a
                href="/user"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
              >
                Settings
              </a>

              <a
                href="/api/logout"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
              >
                Logout
              </a>
            </>
          )
          : (
            <div class="flex flex-col" style="width: 195px">
              <a
                href="/api/login"
                style="min-height:30px"
                class="inline-flex items-center bg-gray-900 hover:bg-gray-800 text-white no-underline rounded"
              >
                <div style="margin: 2px; padding-top:5px; min-height:30px;">
                  <svg
                    height="18"
                    viewBox="0 0 16 16"
                    width="32px"
                    style="fill:white;"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                         0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01
                         1.08.58 1.23.82.72 1.21 1.87.87
                         2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12
                         0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08
                         2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0
                         .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                    />
                  </svg>
                </div>
                <div style="margin-left: 5px;">Sign in with GitHub</div>
              </a>
            </div>
          )}
      </div>
    </div>
  </div>
);

export default LandingPage;
