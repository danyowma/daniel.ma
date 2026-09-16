// Envelope-budgeting math (YNAB-style "rule one": every dollar has a job).
//
// These are pure functions over plain data — the API layer is responsible
// for pulling rows out of D1 and shaping them into the inputs here. Keeping
// the math side-effect-free is what makes it exhaustively testable, which
// matters more here than anywhere else in the app: this is the code that
// decides whether a number on screen is actually correct.

var MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

/** Throws unless `month` is a zero-padded "YYYY-MM" string. */
export function validateMonthKey(month) {
  if (typeof month !== "string" || !MONTH_RE.test(month)) {
    throw new Error(`invalid month key: ${JSON.stringify(month)} (expected "YYYY-MM")`);
  }
  return month;
}

/** Derive a "YYYY-MM" month key from an ISO date string like "2024-03-15". */
export function monthKey(isoDate) {
  if (typeof isoDate !== "string" || !/^\d{4}-\d{2}-\d{2}/.test(isoDate)) {
    throw new Error(`invalid ISO date: ${JSON.stringify(isoDate)}`);
  }
  return validateMonthKey(isoDate.slice(0, 7));
}

/**
 * A category's available balance as of `asOfMonth`, given its ledger
 * entries. Rollover falls out for free: available(month) is the cumulative
 * sum of (assigned - spent) across every entry whose month is <= asOfMonth.
 * A month with no entries at all (a gap) simply contributes nothing, so
 * balances correctly carry through it — positive or negative.
 *
 * entries: [{ month: "YYYY-MM", assignedCents?: number, spentCents?: number }]
 * Money assigned in a month *after* asOfMonth is deliberately excluded —
 * it's committed to that future month, not available before it arrives.
 */
export function categoryAvailableCents(entries, asOfMonth) {
  validateMonthKey(asOfMonth);
  return entries.reduce(function (total, e) {
    validateMonthKey(e.month);
    if (e.month > asOfMonth) return total;
    var assigned = e.assignedCents || 0;
    var spent = e.spentCents || 0;
    if (!Number.isInteger(assigned) || !Number.isInteger(spent)) {
      throw new Error("assignedCents/spentCents must be integer cents");
    }
    return total + assigned - spent;
  }, 0);
}

/**
 * Collapse a category's raw ledger entries (possibly several rows per
 * month, e.g. one per transaction) into one cumulative-available row per
 * distinct month, sorted ascending.
 */
export function monthlyCategorySummary(entries) {
  var byMonth = new Map();
  entries.forEach(function (e) {
    validateMonthKey(e.month);
    var assigned = e.assignedCents || 0;
    var spent = e.spentCents || 0;
    if (!Number.isInteger(assigned) || !Number.isInteger(spent)) {
      throw new Error("assignedCents/spentCents must be integer cents");
    }
    var prev = byMonth.get(e.month) || { assignedCents: 0, spentCents: 0 };
    byMonth.set(e.month, {
      assignedCents: prev.assignedCents + assigned,
      spentCents: prev.spentCents + spent,
    });
  });

  var months = Array.from(byMonth.keys()).sort();
  var running = 0;
  return months.map(function (month) {
    var m = byMonth.get(month);
    running += m.assignedCents - m.spentCents;
    return {
      month: month,
      assignedCents: m.assignedCents,
      spentCents: m.spentCents,
      availableCents: running,
    };
  });
}

/**
 * Ready-to-Assign: money sitting in on-budget accounts that hasn't been
 * given a job yet. Deliberately *not* scoped to a month — assigning money
 * to a future month's category still removes it from this pool today,
 * exactly like YNAB. A negative assignedCents entry (money pulled back out
 * of a category) adds back to the pool.
 *
 * allAssignedEntries: [{ assignedCents: number }] across every category
 * and month.
 */
export function readyToAssignCents(onBudgetBalanceCents, allAssignedEntries) {
  if (!Number.isInteger(onBudgetBalanceCents)) {
    throw new Error("onBudgetBalanceCents must be integer cents");
  }
  var totalAssigned = allAssignedEntries.reduce(function (total, e) {
    if (!Number.isInteger(e.assignedCents)) {
      throw new Error("assignedCents must be integer cents");
    }
    return total + e.assignedCents;
  }, 0);
  return onBudgetBalanceCents - totalAssigned;
}
