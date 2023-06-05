import { Application } from "https://deno.land/x/fresh/mod.ts";

const app = new Application();

addEventListener("fetch", app.fetchEventHandler());
