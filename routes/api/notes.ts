import { HandlerContext } from "$fresh/server.ts";
import { getNotesByUserId, setNotesByUserId } from "./../../helpers/deno-kv.ts";

export const handler = async (
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (req.method === "GET") {
    try {
      const notes = await getNotesByUserId(userId);

      return new Response(JSON.stringify(notes), { status: 200 });
    } catch (_) {
      return new Response("Bad request", { status: 400 });
    }
  }

  if (req.method === "POST") {
    try {
      const notes = await req.json();
      const res = setNotesByUserId(userId, notes);

      return new Response(JSON.stringify(res), { status: 201 });
    } catch (_) {
      return new Response("Bad request", { status: 400 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
};
