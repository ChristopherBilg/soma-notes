// Copyright 2023 Soma Notes
import { Handlers, Status } from "$fresh/server.ts";
import { createGitHubOAuth2Client, createGoogleOAuth2Client, signIn } from "deno-kv-oauth";

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const provider = url.searchParams.get("provider");

    if (!provider) return new Response("Bad request", { status: Status.BadRequest });

    let oauth2Client;
    switch (provider) {
      case "google":
        oauth2Client = createGoogleOAuth2Client({
          redirectUri: "https://somanotes.com",
          defaults: {
            scope: "https://www.googleapis.com/auth/userinfo.profile",
          },
        });
        break;
      case "github":
        oauth2Client = createGitHubOAuth2Client();
        break;
      default:
        return new Response("Bad request", { status: Status.BadRequest });
    }

    if (!oauth2Client) return new Response("Bad request", { status: Status.BadRequest });

    return await signIn(req, oauth2Client);
  },
};
