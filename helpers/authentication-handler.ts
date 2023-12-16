// Copyright 2023-Present Soma Notes
import { HandlerContext } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import {
  AuthProvider,
  AuthUser,
  NullAuthUser,
  Subscription,
} from "../signal/auth.ts";
import { generateJwt } from "./authorization-handler.ts";
import { getGitHubAccessToken, getGitHubUserData } from "./github-auth.ts";

export type AccessTokenResponse = {
  ok: boolean;
  error: string | null;
  accessToken: string | null;
};

export const NullAccessTokenResponse: AccessTokenResponse = {
  ok: false,
  error: null,
  accessToken: null,
};

export type UserDataResponse = {
  ok: boolean;
  error: string | null;
  user: AuthUser;
};

export const NullUserDataResponse: UserDataResponse = {
  ok: false,
  error: null,
  user: NullAuthUser,
};

export const authenticationHandler = async (
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
        provider: AuthProvider.Null,
        userId: "-1",
        userName: "dev",
        avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
        subscription: Subscription.Professional,
      },
    };

    const origin = new URL(request.url).origin;
    const jwt = await generateJwt(userData.user, origin);
    const response = await context.render({ userData });

    setCookie(response.headers, {
      name: "jwt",
      value: jwt,
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return [
      response,
      userData,
    ];
  }

  // Get cookie from request header and parse it
  const maybeAccessToken = getCookies(request.headers)["github_auth_token"];
  if (maybeAccessToken) {
    const userData = await getGitHubUserData(maybeAccessToken);
    if (userData.ok) {
      return [
        await context.render({ userData }),
        userData,
      ];
    }
  }

  // If no cookie, then check to see if this is an OAuth callback request
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return [unauthenticatedResponse, NullUserDataResponse];

  // If there is a code, then we need to exchange it for an access token
  const accessToken = await getGitHubAccessToken(code);
  if (!accessToken.ok) return [unauthenticatedResponse, NullUserDataResponse];

  // If we have an access token, then we can get the user data
  const userData = await getGitHubUserData(accessToken.accessToken as string);
  if (!userData.ok) return [unauthenticatedResponse, NullUserDataResponse];

  // If we have user data from the URL code, then we can render the page, set the cookie, and then generate a JWT
  const response = await context.render({ userData });

  setCookie(response.headers, {
    name: "github_auth_token",
    value: accessToken.accessToken as string,
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  // Generate JWT and set it as a cookie
  const origin = new URL(request.url).origin;
  const jwt = await generateJwt(userData.user, origin);

  setCookie(response.headers, {
    name: "jwt",
    value: jwt,
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  return [response, userData];
};
