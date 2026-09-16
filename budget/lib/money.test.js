import test from "node:test";
import assert from "node:assert/strict";
import { parseCents, formatCents, sumCents } from "./money.js";

test("parseCents: whole dollars", function () {
  assert.equal(parseCents("10"), 1000);
  assert.equal(parseCents("0"), 0);
});

test("parseCents: cents", function () {
  assert.equal(parseCents("10.5"), 1050);
  assert.equal(parseCents("10.50"), 1050);
  assert.equal(parseCents("10.05"), 1005);
});

test("parseCents: negative amounts", function () {
  assert.equal(parseCents("-52.30"), -5230);
  assert.equal(parseCents("-0.01"), -1);
});

test("parseCents: explicit plus sign", function () {
  assert.equal(parseCents("+12.34"), 1234);
});

test("parseCents: strips thousands separators", function () {
  assert.equal(parseCents("1,234.56"), 123456);
});

test("parseCents: trims whitespace", function () {
  assert.equal(parseCents("  9.99  "), 999);
});

test("parseCents: numeric input rounds to nearest cent", function () {
  assert.equal(parseCents(10.005), 1001);
  assert.equal(parseCents(-5.005), -501);
});

test("parseCents: rejects malformed strings", function () {
  assert.throws(function () { parseCents("abc"); });
  assert.throws(function () { parseCents("1.2.3"); });
  assert.throws(function () { parseCents("1.234"); }); // more than 2 decimal places
  assert.throws(function () { parseCents(""); });
  assert.throws(function () { parseCents("   "); });
  assert.throws(function () { parseCents("$5.00"); });
});

test("parseCents: rejects non-finite numbers", function () {
  assert.throws(function () { parseCents(NaN); });
  assert.throws(function () { parseCents(Infinity); });
});

test("parseCents: rejects non-string non-number types", function () {
  assert.throws(function () { parseCents(null); });
  assert.throws(function () { parseCents(undefined); });
  assert.throws(function () { parseCents({}); });
});

test("formatCents: basic values", function () {
  assert.equal(formatCents(1000), "10.00");
  assert.equal(formatCents(0), "0.00");
  assert.equal(formatCents(5), "0.05");
});

test("formatCents: negative values", function () {
  assert.equal(formatCents(-5230), "-52.30");
  assert.equal(formatCents(-1), "-0.01");
});

test("formatCents: rejects non-integers", function () {
  assert.throws(function () { formatCents(10.5); });
  assert.throws(function () { formatCents(NaN); });
});

test("formatCents/parseCents round-trip", function () {
  var samples = ["0.00", "10.00", "-52.30", "1234.56", "-0.01", "999999.99"];
  samples.forEach(function (s) {
    assert.equal(formatCents(parseCents(s)), s.replace("+", ""));
  });
});

test("sumCents: adds a list of cent values", function () {
  assert.equal(sumCents([100, 200, -50]), 250);
  assert.equal(sumCents([]), 0);
});

test("sumCents: rejects non-integer entries", function () {
  assert.throws(function () { sumCents([100, 1.5]); });
});
