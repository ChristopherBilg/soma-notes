// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/_404.tsx";
import * as $1 from "./routes/_500.tsx";
import * as $2 from "./routes/_app.tsx";
import * as $3 from "./routes/api/login.ts";
import * as $4 from "./routes/api/logout.ts";
import * as $5 from "./routes/api/notes.ts";
import * as $6 from "./routes/index.tsx";
import * as $7 from "./routes/notes/[note].tsx";
import * as $$0 from "./islands/DoublePane.tsx";

const manifest = {
  routes: {
    "./routes/_404.tsx": $0,
    "./routes/_500.tsx": $1,
    "./routes/_app.tsx": $2,
    "./routes/api/login.ts": $3,
    "./routes/api/logout.ts": $4,
    "./routes/api/notes.ts": $5,
    "./routes/index.tsx": $6,
    "./routes/notes/[note].tsx": $7,
  },
  islands: {
    "./islands/DoublePane.tsx": $$0,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
