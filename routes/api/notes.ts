// Copyright 2023 Soma Notes
import { Handlers, Status } from "$fresh/server.ts";
import { AuthProvider, AuthUser, NullAuthUser } from "../../signal/auth.ts";
import { getNotesByUser, setNotesByUser } from "./../../helpers/deno-kv.ts";

export const handler: Handlers = {
  async GET(req) {
    const provider = req.headers.get("x-provider");
    const userId = req.headers.get("x-user-id");
    if (!userId || !provider) {
      return new Response("Unauthorized", { status: Status.Unauthorized });
    }

    const userData: AuthUser = {
      ...NullAuthUser,
      provider: (provider as AuthProvider),
      userId,
    };

    try {
      const notes = await getNotesByUser(userData);

      return new Response(JSON.stringify(notes), { status: Status.OK });
    } catch (_) {
      return new Response("Bad request", { status: Status.BadRequest });
    }
  },

  async POST(req) {
    const provider = req.headers.get("x-provider");
    const userId = req.headers.get("x-user-id");
    if (!userId || !provider) {
      return new Response("Unauthorized", { status: Status.Unauthorized });
    }

    const userData: AuthUser = {
      ...NullAuthUser,
      provider: (provider as AuthProvider),
      userId,
    };

    try {
      const notes = await req.json();
      const res = await setNotesByUser(userData, notes);

      return new Response(JSON.stringify(res), { status: Status.Created });
    } catch (_) {
      return new Response("Bad request", { status: Status.BadRequest });
    }
  },
};
