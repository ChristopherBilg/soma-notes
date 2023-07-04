// Copyright 2023 Soma Notes
import { Handlers } from "$fresh/server.ts";
import { signOut } from "deno-kv-oauth";

export const handler: Handlers = {
  async GET(req) {
    return await signOut(req, "https://somanotes.com");
  },
};
