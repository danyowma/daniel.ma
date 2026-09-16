import test from "node:test";
import assert from "node:assert/strict";
import { validateSplits } from "./splits.js";

test("validateSplits: accepts split lines that sum exactly to the parent", function () {
  var splits = [
    { categoryId: 1, amountCents: -3000 },
    { categoryId: 2, amountCents: -2000 },
  ];
  assert.doesNotThrow(function () { validateSplits(splits, -5000); });
});

test("validateSplits: rejects lines that sum to more than the parent", function () {
  var splits = [
    { categoryId: 1, amountCents: -3000 },
    { categoryId: 2, amountCents: -3000 },
  ];
  assert.throws(function () { validateSplits(splits, -5000); }, /sum to/);
});

test("validateSplits: rejects lines that sum to less than the parent", function () {
  var splits = [
    { categoryId: 1, amountCents: -1000 },
    { categoryId: 2, amountCents: -1000 },
  ];
  assert.throws(function () { validateSplits(splits, -5000); }, /sum to/);
});

test("validateSplits: rejects off-by-one-cent totals (no rounding slack)", function () {
  var splits = [
    { categoryId: 1, amountCents: -3333 },
    { categoryId: 2, amountCents: -1666 }, // 4999, one cent short of 5000
  ];
  assert.throws(function () { validateSplits(splits, -5000); });
});

test("validateSplits: rejects empty split list", function () {
  assert.throws(function () { validateSplits([], -5000); });
});

test("validateSplits: rejects a single split line", function () {
  assert.throws(function () { validateSplits([{ categoryId: 1, amountCents: -5000 }], -5000); });
});

test("validateSplits: rejects a zero-amount split line", function () {
  var splits = [
    { categoryId: 1, amountCents: 0 },
    { categoryId: 2, amountCents: -5000 },
  ];
  assert.throws(function () { validateSplits(splits, -5000); });
});

test("validateSplits: rejects a missing categoryId", function () {
  var splits = [
    { amountCents: -3000 },
    { categoryId: 2, amountCents: -2000 },
  ];
  assert.throws(function () { validateSplits(splits, -5000); });
});

test("validateSplits: rejects the same category used twice", function () {
  var splits = [
    { categoryId: 1, amountCents: -3000 },
    { categoryId: 1, amountCents: -2000 },
  ];
  assert.throws(function () { validateSplits(splits, -5000); }, /appears more than once/);
});

test("validateSplits: rejects non-integer amounts", function () {
  var splits = [
    { categoryId: 1, amountCents: -30.5 },
    { categoryId: 2, amountCents: -2000 },
  ];
  assert.throws(function () { validateSplits(splits, -5000); });
});

test("validateSplits: works for positive (income) transactions too", function () {
  var splits = [
    { categoryId: 1, amountCents: 4000 },
    { categoryId: 2, amountCents: 1000 },
  ];
  assert.doesNotThrow(function () { validateSplits(splits, 5000); });
});

test("validateSplits: three-way split summing correctly", function () {
  var splits = [
    { categoryId: 1, amountCents: -1667 },
    { categoryId: 2, amountCents: -1667 },
    { categoryId: 3, amountCents: -1666 },
  ];
  assert.doesNotThrow(function () { validateSplits(splits, -5000); });
});
