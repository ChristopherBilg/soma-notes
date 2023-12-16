// Copyright 2023-Present Soma Notes
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req) {
    const url = new URL("https://github.com/login/oauth/authorize");
    const redirect_uri = new URL(req.url).origin;

    const GITHUB_CLIENT_ID = Deno.env.get("GITHUB_CLIENT_ID");
    if (!GITHUB_CLIENT_ID) {
      throw new Error("Environment variable GITHUB_CLIENT_ID is not set");
    }

    url.searchParams.set("client_id", GITHUB_CLIENT_ID);
    url.searchParams.set("redirect_uri", redirect_uri);

    return Response.redirect(url, 302);
  },
};
