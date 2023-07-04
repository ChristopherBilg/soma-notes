// Copyright 2023 Soma Notes
import { Handlers } from "$fresh/server.ts";
import { asset } from "$fresh/runtime.ts";
import AnchorButton from "../components/AnchorButton.tsx";
import { authHandler } from "../helpers/auth-handler.ts";
import { UserDataResponse } from "../helpers/auth/index.ts";

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
              <AnchorButton
                title="Notes"
                href="/notes"
                roundedLeft
              />

              <AnchorButton
                title="Settings"
                href="/user"
              />

              <AnchorButton
                title="Logout"
                href="/api/logout"
                roundedRight
              />
            </>
          )
          : (
            <div class="flex flex-col gap-3">
              <AnchorButton
                title="Sign in with Google"
                href="/api/login?provider=google"
                icon={
                  <img
                    class="mx-1.5"
                    src={asset("/google_g_logo.svg")}
                    alt="Google logo"
                    height="18px"
                    width="18px"
                  />
                }
                rounded
              />

              <AnchorButton
                title="Sign in with GitHub"
                href="/api/login?provider=github"
                icon={
                  <svg
                    height="18"
                    viewBox="0 0 16 16"
                    width="32px"
                    class="fill-current fill-white"
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
                }
                rounded
              />
            </div>
          )}
      </div>
    </div>
  </div>
);

export default LandingPage;
