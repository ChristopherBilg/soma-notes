// Copyright 2023-Present Soma Notes
import { Head } from "$fresh/runtime.ts";
import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import NavigationButtons from "../../components/NavigationButtons.tsx";
import {
  authenticationHandler,
  UserDataResponse,
} from "../../helpers/authentication-handler.ts";
import DoublePaneIsland from "../../islands/DoublePaneIsland.tsx";

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

type NotesProps = {
  data: { userData: UserDataResponse } | null;
};

const Notes = ({ data }: NotesProps) => (
  <>
    <Head>
      <title>Soma Notes | Notes</title>
    </Head>

    <div class="p-4 mx-auto max-w-screen-xl">
      <h1 class="my-6 text-center">
        Logged in as{" "}
        <b>{data?.userData.user.provider}/{data?.userData.user.userName}</b>!
      </h1>

      <NavigationButtons primary="notes" />

      <DoublePaneIsland userData={data?.userData} />

      <div class="flex flex-col m-2">
        <p class="text-sm text-gray-500">
          The <b>Recently Modified</b> and <b>Right Pane</b>{" "}
          sections currently limit to 10 notes, so if you don't see a note you
          expect to see, it may be because it's not in the top 10. The{" "}
          <b>Recently Modified</b>{" "}
          section is ordered by most recently updated, and the <b>Right Pane</b>
          {" "}
          section is ordered by most recently created.
        </p>
      </div>
    </div>
  </>
);

export default Notes;
