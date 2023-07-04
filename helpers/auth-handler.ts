// Copyright 2023 Soma Notes
import { HandlerContext } from "$fresh/server.ts";
import { AuthProvider } from "../signal/auth.ts";
import { getGitHubUserData } from "./auth/github.ts";
import { NullUserDataResponse, UserDataResponse } from "./auth/index.ts";
import {
  createGitHubOAuth2Client,
  getSessionAccessToken,
  getSessionId,
} from "deno-kv-oauth";

export const authHandler = async (
  request: Request,
  context: HandlerContext,
  unauthenticatedResponse: Response,
): Promise<[Response, UserDataResponse]> => {
  // Development mode: Skip the OAuth flow
  if (Deno.env.get("ENVIRONMENT") === "development") {
    const userData: UserDataResponse = {
      ...NullUserDataResponse,
      ok: true,
      user: {
        provider: AuthProvider.GitHub,
        userId: "-1",
        userName: "dev",
      },
    };
    return [
      await context.render({ userData }),
      userData,
    ];
  }

  // TODO: Try making an oauth2 client per provider until one is successful (or all fail)
  //       If one is successful, then use that one for the rest of the session
  //       If all fail, then return [unauthenticatedResponse, NullUserDataResponse]
  const oauth2Client = createGitHubOAuth2Client();

  const sessionId = await getSessionId(request);
  const isSignedIn = !!sessionId;
  if (!isSignedIn) return [unauthenticatedResponse, NullUserDataResponse];

  const accessToken = await getSessionAccessToken(oauth2Client, sessionId);
  if (!accessToken) return [unauthenticatedResponse, NullUserDataResponse];

  // TODO: Once we have a successful auth client, we should get the user data from the provider
  //       and return it as part of the response
  //       If the user data is not available, then return [unauthenticatedResponse, NullUserDataResponse]
  //       If the user data is available, then return [context.render({ userData }), userData]
  //       Note: The user data should always be available if the access token is valid and the provider is online

  const userData = await getGitHubUserData(accessToken);
  if (!userData.ok) return [unauthenticatedResponse, userData];

  return [
    await context.render({ userData }),
    userData,
  ];
};
