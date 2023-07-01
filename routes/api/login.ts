// Copyright 2023 Soma Notes
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req) {
    const url = new URL("https://github.com/login/oauth/authorize");

    url.searchParams.set("client_id", Deno.env.get("GITHUB_CLIENT_ID") || "");
    url.searchParams.set("redirect_uri", new URL(req.url).origin);

    return Response.redirect(url, 302);
  },
};
