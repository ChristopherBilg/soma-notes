// Copyright 2023-Present Soma Notes
import { Head } from "$fresh/runtime.ts";
import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import {
  authenticationHandler,
  UserDataResponse,
} from "../../../helpers/authentication-handler.ts";
import { getNotesByUserId } from "../../../helpers/mongodb.ts";
import NoteViewerPageIsland from "../../../islands/NoteViewerPageIsland.tsx";
import { Note } from "../../../signal/notes.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const [response, userData] = await authenticationHandler(
      req,
      ctx,
      new Response("Temporary redirect", {
        status: STATUS_CODE.TemporaryRedirect,
        headers: { Location: "/api/signin" },
      }),
    );

    // Check to see if the requested note UUID exists for this user
    const notes = await getNotesByUserId(
      userData.user.provider,
      `${userData.user.userId!}`,
    );

    const url = new URL(req.url);
    const requestedNoteUUID = url.pathname.split("/").at(-1);

    const requestedNote = notes.find((note: Note) =>
      note.uuid === requestedNoteUUID
    );
    if (!requestedNote) return ctx.renderNotFound();

    return response;
  },
};

type NoteProps = {
  data: { userData: UserDataResponse } | null;
  params: Record<string, string>;
};

const Note = ({ data, params }: NoteProps) => (
  <>
    <Head>
      <title>Soma Notes | Note</title>
    </Head>

    <NoteViewerPageIsland params={params} userData={data?.userData} />
  </>
);

export default Note;
