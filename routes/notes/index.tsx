// Copyright 2023 Soma Notes
import { Handlers } from "$fresh/server.ts";
import AnchorButton from "../../components/AnchorButton.tsx";
import { authHandler } from "../../helpers/auth-handler.ts";
import { UserDataResponse } from "../../helpers/github-auth.ts";
import CreateNoteButtonIsland from "../../islands/CreateNoteButtonIsland.tsx";
import DeleteAllNotesButtonIsland from "../../islands/DeleteAllNotesButtonIsland.tsx";
import DoublePaneIsland from "../../islands/DoublePaneIsland.tsx";

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

interface NotesProps {
  data: { userData: UserDataResponse } | null;
}

const Notes = ({ data }: NotesProps) => (
  <div class="p-4 mx-auto max-w-screen-xlg">
    <h1 class="my-6 text-center">
      Welcome to{" "}
      <b>Soma Notes</b>, a simple, global, low-latency note keeping application.
      You are logged in as <b>{data?.userData.userName}</b>!
    </h1>

    <div class="flex justify-center m-4">
      <AnchorButton
        href="/api/logout"
        title="Logout"
        roundedLeft
      />

      <AnchorButton
        href="/user"
        title="Settings"
      />

      {Deno.env.get("ENVIRONMENT") === "development" && (
        <DeleteAllNotesButtonIsland />
      )}

      <CreateNoteButtonIsland />
    </div>

    <DoublePaneIsland userData={data?.userData} />
  </div>
);

export default Notes;
