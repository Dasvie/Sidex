import test from "node:test";
import assert from "node:assert/strict";
import { scoreOf } from "../src/lib/score";

test("reviews weigh 3, comments 1, replies 0.5", () => {
  assert.equal(scoreOf({ reviews: 2, comments: 3, replies: 4 }), 2 * 3 + 3 + 4 * 0.5);
});

test("a single review outranks two comments", () => {
  assert.ok(scoreOf({ reviews: 1, comments: 0, replies: 0 }) > scoreOf({ reviews: 0, comments: 2, replies: 0 }));
});

test("nothing counts as zero", () => {
  assert.equal(scoreOf({ reviews: 0, comments: 0, replies: 0 }), 0);
});
