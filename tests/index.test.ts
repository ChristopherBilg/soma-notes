import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.190.0/testing/asserts.ts";

Deno.test("should always pass", () => {
  assertEquals(true, true);
});

Deno.test("should always fail", () => {
  assertNotEquals(true, false);
});
