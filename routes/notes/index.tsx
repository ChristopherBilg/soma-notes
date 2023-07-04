// Copyright 2023 Soma Notes
import { Handlers, Status } from "$fresh/server.ts";
import AnchorButton from "../../components/AnchorButton.tsx";
import { authHandler } from "../../helpers/auth-handler.ts";
import { UserDataResponse } from "../../helpers/auth/index.ts";
import CreateNoteButtonIsland from "../../islands/CreateNoteButtonIsland.tsx";
import DeleteAllNotesButtonIsland from "../../islands/DeleteAllNotesButtonIsland.tsx";
import DoublePaneIsland from "../../islands/DoublePaneIsland.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const [response] = await authHandler(
      req,
      ctx,
      new Response("", {
        status: Status.TemporaryRedirect,
        headers: { Location: "/api/login" },
      }),
    );

    return response;
  },
};

interface NotesProps {
  data: { userData: UserDataResponse } | null;
}

const Notes = ({ data }: NotesProps) => {
  const { userData } = data || {};
  const { user } = userData || {};
  const { userName, provider } = user || {};

  const showDeleteAllNotesButton =
    Deno.env.get("ENVIRONMENT") === "development";

  return (
    <div class="p-4 mx-auto max-w-screen-xlg">
      <h1 class="my-6 text-center">
        Welcome to{" "}
        <b>Soma Notes</b>, a simple, global, low-latency note keeping
        application. You are logged in as <b>{provider}/{userName}</b>!
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

        {showDeleteAllNotesButton && <DeleteAllNotesButtonIsland />}

        <CreateNoteButtonIsland />
      </div>

      <DoublePaneIsland userData={data?.userData} />
    </div>
  );
};

export default Notes;
