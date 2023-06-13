import { HandlerContext } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import { getAccessToken, getUserData } from "../helpers/github-auth.ts";

export async function handler(
  req: Request,
  ctx: HandlerContext,
): Promise<Response> {
  // Get cookie from request header and parse it
  const maybeAccessToken = getCookies(req.headers)["github_auth_token"];
  if (maybeAccessToken) {
    const userData = await getUserData(maybeAccessToken);
    if (userData.ok) {
      return ctx.render();
    }
  }

  // If no cookie, then check to see if this is an OAuth callback request
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return ctx.render();
  }

  // If there is a code, then we need to exchange it for an access token
  const accessToken = await getAccessToken(code);
  if (!accessToken.ok) {
    return ctx.render();
  }

  // If we have an access token, then we can get the user data
  const userData = await getUserData(accessToken.accessToken as string);
  if (!userData.ok) {
    return ctx.render();
  }

  // If we have user data from the URL code, then we can set the cookie and render the page
  const response = await ctx.render();

  setCookie(response.headers, {
    name: "github_auth_token",
    value: accessToken.accessToken as string,
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
  });

  return response;
}

const LandingPage = () => (
  <div class="p-4 mx-auto max-w-screen-xlg">
    <h1 class="my-6 text-center">
      Welcome to{" "}
      <b>Soma Notes</b>, a simple, global, low-latency note keeping application.
    </h1>

    <h2 class="my-6 text-center">
      <a href="/api/login">Login</a>
    </h2>

    <h2 class="my-6 text-center">
      <a href="/api/logout">Logout</a>
    </h2>

    <h2 class="my-6 text-center">
      <a href="/notes">Notes</a>
    </h2>
  </div>
);

export default LandingPage;
