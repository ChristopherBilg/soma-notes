// Copyright 2023-Present Soma Notes
import { assertEquals } from "$std/testing/asserts.ts";

Deno.test("should always succeed because 'true' === 'true'", () => {
  const actual = true;
  const expected = true;

  assertEquals(
    actual,
    expected,
    `Expected '${actual}' to equal '${expected}' but got '${actual}' instead.`,
  );
});
