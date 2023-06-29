import { HandlerContext } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import {
  getAccessToken,
  getUserData,
  NullUserDataResponse,
  UserDataResponse,
} from "./github-auth.ts";

export const authHandler = async (
  request: Request,
  context: HandlerContext,
  unauthenticatedResponse: Response,
): Promise<[Response, UserDataResponse]> => {
  // Development mode: Skip the OAuth flow
  if (Deno.env.get("ENVIRONMENT") === "development") {
    const userData: UserDataResponse = {
      ok: true,
      error: null,
      userId: "-1",
      userName: "dev",
      avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
    };
    return [
      await context.render({ userData }),
      userData,
    ];
  }

  // Get cookie from request header and parse it
  const maybeAccessToken = getCookies(request.headers)["github_auth_token"];
  if (maybeAccessToken) {
    const userData = await getUserData(maybeAccessToken);
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
  const accessToken = await getAccessToken(code);
  if (!accessToken.ok) return [unauthenticatedResponse, NullUserDataResponse];

  // If we have an access token, then we can get the user data
  const userData = await getUserData(accessToken.accessToken as string);
  if (!userData.ok) return [unauthenticatedResponse, NullUserDataResponse];

  // If we have user data from the URL code, then we can set the cookie and render the page
  const response = await context.render({ userData });

  setCookie(response.headers, {
    name: "github_auth_token",
    value: accessToken.accessToken as string,
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
  });

  return [response, userData];
};
