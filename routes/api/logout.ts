// Copyright 2023 Soma Notes
import { Handlers } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/cookie.ts";

export const handler: Handlers = {
  GET(req) {
    const headers = new Headers({
      "location": new URL(req.url).origin,
    });

    deleteCookie(headers, "github_auth_token", {
      path: "/",
    });

    return new Response(null, {
      status: 302,
      headers,
    });
  },
};
