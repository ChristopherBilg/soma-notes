import { Handlers } from "$fresh/server.ts";
import { authHandler } from "../../helpers/auth-handler.ts";
import { UserDataResponse } from "../../helpers/github-auth.ts";
import NoteViewerIsland from "../../islands/NoteViewerIsland.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const response = await authHandler(
      req,
      ctx,
      new Response("", {
        status: 307,
        headers: { Location: "/api/login" },
      }),
    );

    // TODO: If note doesn't exist, redirect to ctx.renderNotFound()

    return response;
  },
};

interface NoteProps {
  data: { userData: UserDataResponse } | null;
  params: Record<string, string>;
}

const Note = ({ data, params }: NoteProps) => (
  <NoteViewerIsland params={params} userData={data?.userData} />
);

export default Note;
