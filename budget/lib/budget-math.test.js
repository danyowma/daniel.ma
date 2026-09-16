import test from "node:test";
import assert from "node:assert/strict";
import {
  validateMonthKey,
  monthKey,
  categoryAvailableCents,
  monthlyCategorySummary,
  readyToAssignCents,
} from "./budget-math.js";

test("validateMonthKey: accepts well-formed month keys", function () {
  assert.equal(validateMonthKey("2024-01"), "2024-01");
  assert.equal(validateMonthKey("2024-12"), "2024-12");
});

test("validateMonthKey: rejects malformed month keys", function () {
  assert.throws(function () { validateMonthKey("2024-13"); });
  assert.throws(function () { validateMonthKey("2024-00"); });
  assert.throws(function () { validateMonthKey("24-01"); });
  assert.throws(function () { validateMonthKey("2024-1"); });
  assert.throws(function () { validateMonthKey("2024/01"); });
  assert.throws(function () { validateMonthKey(""); });
  assert.throws(function () { validateMonthKey(null); });
});

test("monthKey: derives YYYY-MM from an ISO date", function () {
  assert.equal(monthKey("2024-03-15"), "2024-03");
  assert.equal(monthKey("2024-03-15T10:30:00Z"), "2024-03");
});

test("monthKey: rejects malformed dates", function () {
  assert.throws(function () { monthKey("03/15/2024"); });
  assert.throws(function () { monthKey("not a date"); });
});

test("month keys sort chronologically as plain strings (zero-padding matters)", function () {
  var months = ["2024-10", "2024-02", "2024-09", "2023-12"];
  assert.deepEqual(months.slice().sort(), ["2023-12", "2024-02", "2024-09", "2024-10"]);
});

test("categoryAvailableCents: single month, assign then spend", function () {
  var entries = [{ month: "2024-01", assignedCents: 10000, spentCents: 3000 }];
  assert.equal(categoryAvailableCents(entries, "2024-01"), 7000);
});

test("categoryAvailableCents: positive balance rolls over to next month", function () {
  var entries = [
    { month: "2024-01", assignedCents: 10000, spentCents: 3000 }, // avail 7000
    { month: "2024-02", assignedCents: 0, spentCents: 2000 },
  ];
  assert.equal(categoryAvailableCents(entries, "2024-02"), 5000);
});

test("categoryAvailableCents: overspending carries a negative balance forward", function () {
  var entries = [
    { month: "2024-01", assignedCents: 5000, spentCents: 8000 }, // avail -3000
    { month: "2024-02", assignedCents: 2000, spentCents: 0 },
  ];
  assert.equal(categoryAvailableCents(entries, "2024-01"), -3000);
  assert.equal(categoryAvailableCents(entries, "2024-02"), -1000);
});

test("categoryAvailableCents: balance carries correctly through a gap month with no entries", function () {
  var entries = [{ month: "2024-01", assignedCents: 10000, spentCents: 0 }];
  // Nothing happened in Feb; asking about March should still see January's money.
  assert.equal(categoryAvailableCents(entries, "2024-03"), 10000);
});

test("categoryAvailableCents: money assigned to a future month is excluded from earlier months", function () {
  var entries = [
    { month: "2024-01", assignedCents: 0, spentCents: 0 },
    { month: "2024-03", assignedCents: 5000, spentCents: 0 },
  ];
  assert.equal(categoryAvailableCents(entries, "2024-02"), 0);
  assert.equal(categoryAvailableCents(entries, "2024-03"), 5000);
});

test("categoryAvailableCents: multiple entries in the same month are summed", function () {
  var entries = [
    { month: "2024-01", spentCents: 2000 },
    { month: "2024-01", spentCents: 3000 },
    { month: "2024-01", assignedCents: 10000 },
  ];
  assert.equal(categoryAvailableCents(entries, "2024-01"), 5000);
});

test("categoryAvailableCents: empty entries is zero", function () {
  assert.equal(categoryAvailableCents([], "2024-01"), 0);
});

test("categoryAvailableCents: rejects non-integer cent values", function () {
  var entries = [{ month: "2024-01", assignedCents: 10.5 }];
  assert.throws(function () { categoryAvailableCents(entries, "2024-01"); });
});

test("categoryAvailableCents: rejects malformed month keys anywhere in the entries", function () {
  var entries = [{ month: "2024-1", assignedCents: 100 }];
  assert.throws(function () { categoryAvailableCents(entries, "2024-01"); });
});

test("monthlyCategorySummary: produces cumulative rollover per month, sorted", function () {
  var entries = [
    { month: "2024-02", assignedCents: 0, spentCents: 2000 },
    { month: "2024-01", assignedCents: 10000, spentCents: 3000 },
  ];
  var summary = monthlyCategorySummary(entries);
  assert.deepEqual(summary, [
    { month: "2024-01", assignedCents: 10000, spentCents: 3000, availableCents: 7000 },
    { month: "2024-02", assignedCents: 0, spentCents: 2000, availableCents: 5000 },
  ]);
});

test("monthlyCategorySummary: merges multiple rows in the same month before rolling forward", function () {
  var entries = [
    { month: "2024-01", spentCents: 1000 },
    { month: "2024-01", spentCents: 500, assignedCents: 6000 },
  ];
  var summary = monthlyCategorySummary(entries);
  assert.deepEqual(summary, [
    { month: "2024-01", assignedCents: 6000, spentCents: 1500, availableCents: 4500 },
  ]);
});

test("monthlyCategorySummary: agrees with categoryAvailableCents for every month produced", function () {
  var entries = [
    { month: "2024-01", assignedCents: 10000, spentCents: 3000 },
    { month: "2024-03", assignedCents: 2000, spentCents: 9000 }, // overspend
    { month: "2024-04", assignedCents: 500, spentCents: 0 },
  ];
  var summary = monthlyCategorySummary(entries);
  summary.forEach(function (row) {
    assert.equal(row.availableCents, categoryAvailableCents(entries, row.month));
  });
});

test("monthlyCategorySummary: empty input is empty output", function () {
  assert.deepEqual(monthlyCategorySummary([]), []);
});

test("readyToAssignCents: subtracts total assigned from on-budget balance", function () {
  var assigned = [{ assignedCents: 10000 }, { assignedCents: 25000 }];
  assert.equal(readyToAssignCents(100000, assigned), 65000);
});

test("readyToAssignCents: assigning to a future month still reduces the pool today", function () {
  // Same total assigned regardless of which months it's spread across —
  // RTA has no month parameter at all, on purpose.
  var assignedAllThisMonth = [{ assignedCents: 20000 }];
  var assignedSplitAcrossMonths = [{ assignedCents: 15000 }, { assignedCents: 5000 }];
  assert.equal(
    readyToAssignCents(100000, assignedAllThisMonth),
    readyToAssignCents(100000, assignedSplitAcrossMonths)
  );
});

test("readyToAssignCents: a negative assignment (money pulled back to RTA) increases the pool", function () {
  var assigned = [{ assignedCents: 10000 }, { assignedCents: -4000 }];
  assert.equal(readyToAssignCents(100000, assigned), 94000);
});

test("readyToAssignCents: no assignments yet means the whole balance is ready", function () {
  assert.equal(readyToAssignCents(50000, []), 50000);
});

test("readyToAssignCents: can go negative when over-assigned", function () {
  var assigned = [{ assignedCents: 60000 }];
  assert.equal(readyToAssignCents(50000, assigned), -10000);
});

test("readyToAssignCents: rejects non-integer inputs", function () {
  assert.throws(function () { readyToAssignCents(100.5, []); });
  assert.throws(function () { readyToAssignCents(100, [{ assignedCents: 1.5 }]); });
});
