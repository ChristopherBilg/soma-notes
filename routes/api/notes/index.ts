// Copyright 2023-Present Soma Notes
import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import {
  authorizationHandler,
  getJwtPayload,
} from "../../../helpers/authorization-handler.ts";
import {
  getNotesByUserId,
  setNotesByUserId,
} from "../../../helpers/mongodb.ts";
import { AuthProvider, Subscription } from "../../../signal/auth.ts";
import {
  getMaxNoteCount,
  getMaxNoteLength,
  Note,
} from "../../../signal/notes.ts";

export const handler: Handlers = {
  async GET(req) {
    const provider = req.headers.get("x-provider");
    const userId = req.headers.get("x-user-id");
    const jwt = getCookies(req.headers)["jwt"];

    if (!provider || !userId || !jwt) {
      console.error("Unauthorized via headers");
      return new Response("Unauthorized", { status: STATUS_CODE.Unauthorized });
    }

    if (!(await authorizationHandler(userId, jwt))) {
      console.error("Unauthorized via authorizationHandler");
      return new Response("Unauthorized", { status: STATUS_CODE.Unauthorized });
    }

    try {
      const notes = await getNotesByUserId(provider as AuthProvider, userId);

      return new Response(JSON.stringify(notes), { status: STATUS_CODE.OK });
    } catch (e) {
      console.error("Error getting notes:", e);
      return new Response("Bad request", { status: STATUS_CODE.BadRequest });
    }
  },

  async POST(req) {
    const provider = req.headers.get("x-provider");
    const userId = req.headers.get("x-user-id");
    const jwt = getCookies(req.headers)["jwt"];

    if (!provider || !userId || !jwt) {
      console.error("Unauthorized via headers");
      return new Response("Unauthorized", { status: STATUS_CODE.Unauthorized });
    }

    if (!(await authorizationHandler(userId, jwt))) {
      console.error("Unauthorized via authorizationHandler");
      return new Response("Unauthorized", { status: STATUS_CODE.Unauthorized });
    }

    const payload = await getJwtPayload(jwt);
    if (!payload?.subscription) {
      console.error("Unauthorized via subscription");
      return new Response("Unauthorized", { status: STATUS_CODE.Unauthorized });
    }
    const subscription = payload.subscription as Subscription;

    try {
      const notes = await req.json();

      // Subscription limit checks
      if (notes.length > getMaxNoteCount(subscription)) {
        console.error("Unauthorized via max note count");
        return new Response("Unauthorized", {
          status: STATUS_CODE.Unauthorized,
        });
      }
      if (
        notes.some((note: Note) =>
          note.content.length > getMaxNoteLength(subscription)
        )
      ) {
        console.error("Unauthorized via max note length");
        return new Response("Unauthorized", {
          status: STATUS_CODE.Unauthorized,
        });
      }

      const response = await setNotesByUserId(
        provider as AuthProvider,
        userId,
        notes,
      );

      return new Response(JSON.stringify(response), {
        status: STATUS_CODE.Created,
      });
    } catch (e) {
      console.error("Error setting notes:", e);
      return new Response("Bad request", { status: STATUS_CODE.BadRequest });
    }
  },
};
