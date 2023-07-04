// Copyright 2023 Soma Notes
import { Handlers, Status } from "$fresh/server.ts";
import { authHandler } from "../../helpers/auth-handler.ts";
import { getNotesByUser } from "../../helpers/deno-kv.ts";
import { UserDataResponse } from "../../helpers/auth/index.ts";
import NoteViewerPageIsland from "../../islands/NoteViewerPageIsland.tsx";
import { Note } from "../../signal/notes.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const [response, userData] = await authHandler(
      req,
      ctx,
      new Response("", {
        status: Status.TemporaryRedirect,
        headers: { Location: "/api/login" },
      }),
    );

    // Check to see if the requested note UUID exists for this user
    const notes = await getNotesByUser(userData.user);

    const url = new URL(req.url);
    const requestedNoteUUID = url.pathname.split("/").at(-1);

    const requestedNote = notes.find((note: Note) =>
      note.uuid === requestedNoteUUID
    );
    if (!requestedNote) return ctx.renderNotFound();

    return response;
  },
};

interface NoteProps {
  data: { userData: UserDataResponse } | null;
  params: Record<string, string>;
}

const Note = ({ data, params }: NoteProps) => (
  <NoteViewerPageIsland params={params} userData={data?.userData} />
);

export default Note;
