import { HandlerContext } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import { getAccessToken, getUserData } from "./github-auth.ts";

export const authHandler = async (
  request: Request,
  context: HandlerContext,
  unauthenticatedResponse: Response,
) => {
  // Get cookie from request header and parse it
  const maybeAccessToken = getCookies(request.headers)["github_auth_token"];
  if (maybeAccessToken) {
    const userData = await getUserData(maybeAccessToken);
    if (userData.ok) return context.render({ userData });
  }

  // If no cookie, then check to see if this is an OAuth callback request
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return unauthenticatedResponse;

  // If there is a code, then we need to exchange it for an access token
  const accessToken = await getAccessToken(code);
  if (!accessToken.ok) return unauthenticatedResponse;

  // If we have an access token, then we can get the user data
  const userData = await getUserData(accessToken.accessToken as string);
  if (!userData.ok) return unauthenticatedResponse;

  // If we have user data from the URL code, then we can set the cookie and render the page
  const response = await context.render({ userData });

  setCookie(response.headers, {
    name: "github_auth_token",
    value: accessToken.accessToken as string,
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
  });

  return response;
};
