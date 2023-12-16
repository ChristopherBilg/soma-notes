// Copyright 2023-Present Soma Notes
import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import {
  authorizationHandler,
  getJwtPayload,
} from "../../../helpers/authorization-handler.ts";
import {
  getJournalsByUserId,
  setJournalsByUserId,
} from "../../../helpers/mongodb.ts";
import { AuthProvider, Subscription } from "../../../signal/auth.ts";
import {
  getMaxJournalCount,
  getMaxJournalLength,
  Journal,
} from "../../../signal/journals.ts";

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
      const journals = await getJournalsByUserId(
        provider as AuthProvider,
        userId,
      );

      return new Response(JSON.stringify(journals), { status: STATUS_CODE.OK });
    } catch (e) {
      console.error("Error getting journals:", e);
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
      const journals = await req.json();

      // Subscription limit checks
      if (journals.length > getMaxJournalCount(subscription)) {
        console.error("Unauthorized via max journal count");
        return new Response("Unauthorized", {
          status: STATUS_CODE.Unauthorized,
        });
      }
      if (
        journals.some((journal: Journal) =>
          journal.content.length > getMaxJournalLength(subscription)
        )
      ) {
        console.error("Unauthorized via max journal length");
        return new Response("Unauthorized", {
          status: STATUS_CODE.Unauthorized,
        });
      }

      const response = await setJournalsByUserId(
        provider as AuthProvider,
        userId,
        journals,
      );

      return new Response(JSON.stringify(response), {
        status: STATUS_CODE.Created,
      });
    } catch (e) {
      console.error("Error setting journals:", e);
      return new Response("Bad request", { status: STATUS_CODE.BadRequest });
    }
  },
};
