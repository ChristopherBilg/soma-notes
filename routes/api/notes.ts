// Copyright 2023 Soma Notes
import { Handlers } from "$fresh/server.ts";
import { getNotesByUserId, setNotesByUserId } from "./../../helpers/deno-kv.ts";

export const handler: Handlers = {
  async GET(req) {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const notes = await getNotesByUserId(userId);

      return new Response(JSON.stringify(notes), { status: 200 });
    } catch (_) {
      return new Response("Bad request", { status: 400 });
    }
  },

  async POST(req) {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const notes = await req.json();
      const res = await setNotesByUserId(userId, notes);

      return new Response(JSON.stringify(res), { status: 201 });
    } catch (_) {
      return new Response("Bad request", { status: 400 });
    }
  },
};
