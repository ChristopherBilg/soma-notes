import { Handlers } from "$fresh/server.ts";
import { authHandler } from "../../helpers/auth-handler.ts";
import { UserDataResponse } from "../../helpers/github-auth.ts";
import DoublePane from "../../islands/DoublePane.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const response = await authHandler(
      req,
      ctx,
      new Response("", {
        status: 307,
        headers: { Location: "/api/login" },
      }),
    );

    return response;
  },
};

interface NotesProps {
  data: { userData: UserDataResponse } | null;
}

const Notes = ({ data }: NotesProps) => (
  <div class="p-4 mx-auto max-w-screen-xlg">
    <h1 class="my-6 text-center">
      Welcome to{" "}
      <b>Soma Notes</b>, a simple, global, low-latency note keeping application.
      You are {data?.userData.userName || "not logged in"}!
    </h1>

    <h2 class="my-6 text-center">
      {data?.userData.userId
        ? <a href="/api/logout">Logout</a>
        : <a href="/api/login">Login</a>}
    </h2>

    <DoublePane
      minLeftWidth={200}
      minRightWidth={200}
      userData={data?.userData}
    />
  </div>
);

export default Notes;
