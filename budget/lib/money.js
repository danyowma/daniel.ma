// All money in this app is represented as integer cents to avoid floating
// point drift. These helpers are the only place strings/floats touch cents.

/**
 * Parse a decimal amount string (e.g. "-52.3", "10", "1,234.56") into an
 * integer number of cents. Throws on malformed input rather than silently
 * truncating — a budget app should never guess at an amount.
 */
export function parseCents(input) {
  if (typeof input === "number") {
    if (!Number.isFinite(input)) throw new Error(`not a finite number: ${input}`);
    // Round half away from zero, symmetrically for negatives — plain
    // Math.round(input * 100) rounds -X.5 toward +Infinity (i.e. up, not
    // away from zero), which is the wrong direction for a negative amount.
    var sign = input < 0 ? -1 : 1;
    return sign * Math.round(Math.abs(input) * 100);
  }
  if (typeof input !== "string") {
    throw new Error(`cannot parse cents from ${typeof input}`);
  }
  var s = input.trim().replace(/,/g, "");
  if (s === "") throw new Error("empty amount");
  if (!/^[+-]?\d+(\.\d{1,2})?$/.test(s)) {
    throw new Error(`malformed amount: ${input}`);
  }
  var negative = s[0] === "-";
  if (s[0] === "+" || s[0] === "-") s = s.slice(1);
  var parts = s.split(".");
  var whole = parseInt(parts[0], 10);
  var fracStr = (parts[1] || "").padEnd(2, "0");
  var frac = parseInt(fracStr, 10);
  var cents = whole * 100 + frac;
  return negative ? -cents : cents;
}

/** Format integer cents as a fixed 2-decimal string, e.g. -5230 -> "-52.30". */
export function formatCents(cents) {
  if (!Number.isInteger(cents)) throw new Error(`cents must be an integer, got ${cents}`);
  var negative = cents < 0;
  var abs = Math.abs(cents);
  var whole = Math.floor(abs / 100);
  var frac = String(abs % 100).padStart(2, "0");
  return (negative ? "-" : "") + whole + "." + frac;
}

/** Sum an array of integer cents, validating every entry is an integer. */
export function sumCents(centsArray) {
  return centsArray.reduce(function (total, c) {
    if (!Number.isInteger(c)) throw new Error(`cents must be an integer, got ${c}`);
    return total + c;
  }, 0);
}
