import { Handlers } from "$fresh/server.ts";
import { authHandler } from "../../helpers/auth-handler.ts";
import { UserDataResponse } from "../../helpers/github-auth.ts";
import CreateNoteButtonIsland from "../../islands/CreateNoteButtonIsland.tsx";
import DoublePaneIsland from "../../islands/DoublePaneIsland.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const response = await authHandler(
      req,
      ctx,
      new Response("", {
        status: 307,
        headers: { Location: "/api/login" },
      })
    );

    return response;
  },
};

interface NotesProps {
  data: { userData: UserDataResponse } | null;
}

const Notes = ({ data }: NotesProps) => (
  <div class="p-4 mx-auto max-w-screen-xlg">
    <h1 class="my-6 text-center">
      Welcome to <b>Soma Notes</b>, a simple, global, low-latency note keeping application. You are logged in as{" "}
      {data?.userData.userName}!
    </h1>

    <div class="flex justify-evenly m-4">
      <a href="/api/logout" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Logout
      </a>

      <CreateNoteButtonIsland />
    </div>

    <DoublePaneIsland userData={data?.userData} />
  </div>
);

export default Notes;
