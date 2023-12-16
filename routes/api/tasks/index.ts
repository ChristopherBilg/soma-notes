// Copyright 2023-Present Soma Notes
import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import {
  authorizationHandler,
  getJwtPayload,
} from "../../../helpers/authorization-handler.ts";
import {
  getTasksByUserId,
  setTasksByUserId,
} from "../../../helpers/mongodb.ts";
import { AuthProvider, Subscription } from "../../../signal/auth.ts";
import {
  getMaxTaskCount,
  getMaxTaskLength,
  Task,
} from "../../../signal/tasks.ts";

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
      const tasks = await getTasksByUserId(
        provider as AuthProvider,
        userId,
      );

      return new Response(JSON.stringify(tasks), { status: STATUS_CODE.OK });
    } catch (e) {
      console.error("Error getting tasks:", e);
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
      const tasks = await req.json();

      // Subscription limit checks
      if (tasks.length > getMaxTaskCount(subscription)) {
        console.error("Unauthorized via max task count");
        return new Response("Unauthorized", {
          status: STATUS_CODE.Unauthorized,
        });
      }
      if (
        tasks.some((task: Task) =>
          task.content.length > getMaxTaskLength(subscription)
        )
      ) {
        console.error("Unauthorized via max task length");
        return new Response("Unauthorized", {
          status: STATUS_CODE.Unauthorized,
        });
      }

      const response = await setTasksByUserId(
        provider as AuthProvider,
        userId,
        tasks,
      );

      return new Response(JSON.stringify(response), {
        status: STATUS_CODE.Created,
      });
    } catch (e) {
      console.error("Error setting tasks:", e);
      return new Response("Bad request", { status: STATUS_CODE.BadRequest });
    }
  },
};
