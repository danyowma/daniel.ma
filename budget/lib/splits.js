// A split transaction divides one register entry's amount across multiple
// categories. The one invariant that must always hold: the split lines sum
// exactly to the parent transaction's amount, in cents (no float slop,
// since everything here is already an integer).

/**
 * Throws unless `splits` (an array of { categoryId, amountCents }) sums
 * exactly to `parentAmountCents`. Returns nothing on success.
 */
export function validateSplits(splits, parentAmountCents) {
  if (!Number.isInteger(parentAmountCents)) {
    throw new Error("parentAmountCents must be integer cents");
  }
  if (!Array.isArray(splits) || splits.length === 0) {
    throw new Error("a split transaction needs at least one split line");
  }
  if (splits.length === 1) {
    throw new Error("a single split line is just the whole transaction — not a split");
  }

  var seenCategories = new Set();
  var total = 0;
  splits.forEach(function (line, i) {
    if (!Number.isInteger(line.amountCents)) {
      throw new Error(`split line ${i}: amountCents must be integer cents`);
    }
    if (line.amountCents === 0) {
      throw new Error(`split line ${i}: amountCents cannot be zero`);
    }
    if (!line.categoryId) {
      throw new Error(`split line ${i}: categoryId is required`);
    }
    if (seenCategories.has(line.categoryId)) {
      throw new Error(`split line ${i}: category ${line.categoryId} appears more than once`);
    }
    seenCategories.add(line.categoryId);
    total += line.amountCents;
  });

  if (total !== parentAmountCents) {
    throw new Error(
      `split lines sum to ${total} cents but the transaction is ${parentAmountCents} cents`
    );
  }
}
