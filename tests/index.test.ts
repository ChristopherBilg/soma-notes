import { assertEquals, assertNotEquals } from "$std/testing/asserts.ts";

Deno.test("should always pass", () => {
  assertEquals(true, true);
});

Deno.test("should always fail", () => {
  assertNotEquals(true, false);
});
