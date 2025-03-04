import { expect, test } from "vitest";

import { sum } from "./example";

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

test("adds 10 + -10 to equal 0", () => {
  expect(sum(10, -10)).toBe(0);
});

test("result should be true", () => {
  const result = true;
  expect(result).toBe(true);
});
