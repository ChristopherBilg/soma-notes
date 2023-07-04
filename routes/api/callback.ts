// Copyright 2023 Soma Notes
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req) {
    return new Response(new Request(req).url);
  },
};
