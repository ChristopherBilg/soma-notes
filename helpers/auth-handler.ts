// Copyright 2023 Soma Notes
import { HandlerContext } from "$fresh/server.ts";
import { AuthProvider } from "../signal/auth.ts";
import { getGitHubUserData } from "./auth/github.ts";
import { NullUserDataResponse, UserDataResponse } from "./auth/index.ts";
import {
  createGitHubOAuth2Client,
  createGoogleOAuth2Client,
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

  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");
  let oauth2Client;

  switch (provider) {
    case "google":
      oauth2Client = createGoogleOAuth2Client({
        redirectUri: "https://somanotes.com/api/callback",
        defaults: {
          scope: "https://www.googleapis.com/auth/userinfo.profile",
        },
      });
      break;
    case "github":
      oauth2Client = createGitHubOAuth2Client();
      break;
    default:
      return [unauthenticatedResponse, NullUserDataResponse];
  }

  const sessionId = await getSessionId(request);
  const isSignedIn = !!sessionId;
  if (!isSignedIn) return [unauthenticatedResponse, NullUserDataResponse];

  const accessToken = await getSessionAccessToken(oauth2Client, sessionId);
  if (!accessToken) return [unauthenticatedResponse, NullUserDataResponse];

  let userData: UserDataResponse = NullUserDataResponse;
  switch (provider) {
    case "google":
      break;
    case "github":
      userData = await getGitHubUserData(accessToken);
      return [await context.render({ userData }), userData];
    default:
      return [unauthenticatedResponse, NullUserDataResponse];
  }

  return [
    await context.render({ userData }),
    userData,
  ];

  // // Get cookie from request header and parse it
  // const maybeAccessToken = getCookies(request.headers)["github_auth_token"];
  // if (maybeAccessToken) {
  // const userData = await getUserData(maybeAccessToken);
  //   if (userData.ok) {
  //     return [
  //       await context.render({ userData }),
  //       userData,
  //     ];
  //   }
  // }

  // // If no cookie, then check to see if this is an OAuth callback request
  // const url = new URL(request.url);
  // const code = url.searchParams.get("code");
  // if (!code) return [unauthenticatedResponse, NullUserDataResponse];

  // // If there is a code, then we need to exchange it for an access token
  // const accessToken = await getAccessToken(code);
  // if (!accessToken.ok) return [unauthenticatedResponse, NullUserDataResponse];

  // // If we have an access token, then we can get the user data
  // const userData = await getUserData(accessToken.accessToken as string);
  // if (!userData.ok) return [unauthenticatedResponse, NullUserDataResponse];

  // // If we have user data from the URL code, then we can set the cookie and render the page
  // const response = await context.render({ userData });

  // setCookie(response.headers, {
  //   name: "github_auth_token",
  //   value: accessToken.accessToken as string,
  //   maxAge: 60 * 60 * 24 * 7,
  //   httpOnly: true,
  // });

  // return [response, userData];
};
