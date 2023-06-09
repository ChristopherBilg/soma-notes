import { HandlerContext, PageProps } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";
import {
  getAccessToken,
  getUserData,
  UserDataResponse,
} from "../helpers/github-auth.ts";
import DoublePane from "../islands/DoublePane.tsx";

export async function handler(
  req: Request,
  ctx: HandlerContext,
): Promise<Response> {
  // Get cookie from request header and parse it
  const maybeAccessToken = getCookies(req.headers)["github_auth_token"];

  // Get database instance
  if (maybeAccessToken) {
    const userData = await getUserData(maybeAccessToken);
    if (userData.ok) {
      return ctx.render({ userData });
    }
  }

  // This is an oauth callback request.
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response("", {
      status: 307,
      headers: { Location: "/api/login" },
    });
  }

  const accessToken = await getAccessToken(code);
  if (!accessToken.ok) {
    return new Response("", {
      status: 307,
      headers: { Location: "/api/login" },
    });
  }

  const userData = await getUserData(accessToken.accessToken as string);
  if (!userData.ok) {
    return new Response("", {
      status: 307,
      headers: { Location: "/api/login" },
    });
  }

  // await database.insertUser({
  //   userId: userData.userId,
  //   userName: userData.userName,
  //   accessToken,
  //   avatarUrl: userData.avatarUrl,
  // });

  const response = await ctx.render({ userData });

  setCookie(response.headers, {
    name: "github_auth_token",
    value: accessToken.accessToken as string,
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
  });

  return response;
}

const Index = ({ data }: PageProps<{ userData: UserDataResponse }>) => {
  const isAuthenticated = !!data?.userData?.userName;

  return (
    <div class="p-4 mx-auto max-w-screen-xlg">
      <h1 class="my-6 text-center">
        Welcome to{" "}
        <b>Soma Notes</b>, a simple, global, low-latency note keeping
        application. You are{" "}
        {isAuthenticated ? data?.userData?.userName : "not logged in"}!
      </h1>

      <h2 class="my-6 text-center">
        {!isAuthenticated
          ? <a href="/api/login">Login</a>
          : <a href="/api/logout">Logout</a>}
      </h2>

      <DoublePane
        minLeftWidth={200}
        minRightWidth={200}
      />
    </div>
  );
};

export default Index;
