// Copyright 2023-Present Soma Notes
import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/cookie.ts";

export const handler: Handlers = {
  GET(req) {
    const headers = new Headers({
      "location": new URL(req.url).origin,
    });

    deleteCookie(headers, "github_auth_token", {
      path: "/",
    });

    deleteCookie(headers, "jwt", {
      path: "/",
    });

    return new Response("Signed out", {
      status: STATUS_CODE.Found,
      headers,
    });
  },
};
