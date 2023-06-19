import { assertEquals } from "$std/testing/asserts.ts";
import { collectModules, findCircular, report } from "seeker/mod.ts";

Deno.test("dependency graph inspection - no circular", () => {
  const { circular } = report("..");

  assertEquals(circular.length, 0);

  if (circular.length) console.log(findCircular(collectModules("..")));
});
