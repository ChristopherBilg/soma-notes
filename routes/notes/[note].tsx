import { Handlers } from "$fresh/server.ts";
import { authHandler } from "../../helpers/auth-handler.ts";
import { UserDataResponse } from "../../helpers/github-auth.ts";

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

    return response;
  },
};

interface NoteProps {
  data: { userData: UserDataResponse } | null;
  params: Record<string, string>;
}

const Note = ({ data, params }: NoteProps) => {
  console.log("data", data);
  console.log("params", params);

  return <div>Note ID: {params.note}</div>;
};

export default Note;
