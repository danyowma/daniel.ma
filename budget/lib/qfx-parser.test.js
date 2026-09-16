import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parseQfx, dedupeByFitid } from "./qfx-parser.js";

var __dirname = path.dirname(fileURLToPath(import.meta.url));
function fixture(name) {
  return readFileSync(path.join(__dirname, "fixtures", name), "utf8");
}

test("parseQfx: parses OFX 1.x SGML (unclosed leaf tags, bracketed timezone)", function () {
  var txns = parseQfx(fixture("sample-ofx1.qfx"));
  assert.equal(txns.length, 3);

  assert.deepEqual(txns[0], {
    fitid: "20240102-0001",
    date: "2024-01-02",
    amountCents: -5230,
    payee: "WHOLE FOODS MARKET",
    memo: "groceries",
    trnType: "DEBIT",
  });

  assert.deepEqual(txns[1], {
    fitid: "20240105-0002",
    date: "2024-01-05",
    amountCents: 150000,
    payee: "ACME CORP PAYROLL",
    memo: "",
    trnType: "CREDIT",
  });

  // Whole-dollar amount with no decimal point, DTPOSTED with fractional seconds.
  assert.equal(txns[2].amountCents, -20000);
  assert.equal(txns[2].date, "2024-01-10");
});

test("parseQfx: parses OFX 2.x well-formed XML", function () {
  var txns = parseQfx(fixture("sample-ofx2.qfx"));
  assert.equal(txns.length, 2);

  assert.deepEqual(txns[0], {
    fitid: "xml-0001",
    date: "2024-02-03",
    amountCents: -1842,
    payee: "TARGET STORE #1234", // falls back to PAYEE when NAME is absent
    memo: "household",
    trnType: "POS",
  });

  assert.equal(txns[1].fitid, "xml-0002");
  assert.equal(txns[1].amountCents, 50000);
  assert.equal(txns[1].payee, "TRANSFER FROM CHECKING");
});

test("parseQfx: rejects empty input", function () {
  assert.throws(function () { parseQfx(""); });
  assert.throws(function () { parseQfx("   "); });
});

test("parseQfx: a file with no STMTTRN blocks parses to an empty list", function () {
  assert.deepEqual(parseQfx("<OFX><SIGNONMSGSRSV1></SIGNONMSGSRSV1></OFX>"), []);
});

test("parseQfx: throws on a transaction missing FITID", function () {
  var bad = `<OFX><STMTTRN><TRNTYPE>DEBIT<DTPOSTED>20240102<TRNAMT>-10.00<NAME>X</STMTTRN></OFX>`;
  assert.throws(function () { parseQfx(bad); }, /FITID/);
});

test("parseQfx: throws on a transaction missing TRNAMT", function () {
  var bad = `<OFX><STMTTRN><DTPOSTED>20240102<FITID>1<NAME>X</STMTTRN></OFX>`;
  assert.throws(function () { parseQfx(bad); }, /TRNAMT/);
});

test("parseQfx: throws on malformed DTPOSTED", function () {
  var bad = `<OFX><STMTTRN><DTPOSTED>notadate<TRNAMT>-10.00<FITID>1<NAME>X</STMTTRN></OFX>`;
  assert.throws(function () { parseQfx(bad); }, /DTPOSTED/);
});

test("parseQfx: throws on malformed TRNAMT", function () {
  var bad = `<OFX><STMTTRN><DTPOSTED>20240102<TRNAMT>abc<FITID>1<NAME>X</STMTTRN></OFX>`;
  assert.throws(function () { parseQfx(bad); }, /TRNAMT/);
});

test("parseQfx: second transaction's error still identifies the right block", function () {
  var bad = [
    "<OFX><STMTTRN><DTPOSTED>20240102<TRNAMT>-10.00<FITID>1<NAME>ok</STMTTRN>",
    "<STMTTRN><DTPOSTED>20240103<TRNAMT>-10.00<NAME>bad</STMTTRN></OFX>",
  ].join("\n");
  assert.throws(function () { parseQfx(bad); }, /transaction #2/);
});

test("dedupeByFitid: drops transactions whose FITID already exists", function () {
  var txns = parseQfx(fixture("sample-ofx1.qfx"));
  var existing = new Set(["20240105-0002"]);
  var result = dedupeByFitid(txns, existing);
  assert.equal(result.length, 2);
  assert.ok(!result.some(function (t) { return t.fitid === "20240105-0002"; }));
});

test("dedupeByFitid: drops duplicate FITIDs within the same batch, keeping the first", function () {
  var txns = [
    { fitid: "a", date: "2024-01-01", amountCents: -100, payee: "X", memo: "", trnType: "" },
    { fitid: "a", date: "2024-01-01", amountCents: -999, payee: "DUPLICATE", memo: "", trnType: "" },
    { fitid: "b", date: "2024-01-02", amountCents: -200, payee: "Y", memo: "", trnType: "" },
  ];
  var result = dedupeByFitid(txns, []);
  assert.equal(result.length, 2);
  assert.equal(result[0].payee, "X");
});

test("dedupeByFitid: re-importing the exact same file a second time yields nothing new", function () {
  var txns = parseQfx(fixture("sample-ofx1.qfx"));
  var alreadyImported = new Set(txns.map(function (t) { return t.fitid; }));
  assert.deepEqual(dedupeByFitid(txns, alreadyImported), []);
});

test("dedupeByFitid: overlapping date ranges only import the new transactions", function () {
  var monthOne = parseQfx(fixture("sample-ofx1.qfx"));
  // Simulate re-downloading a range that overlaps: bank re-sends the same
  // three FITIDs plus one genuinely new one.
  var overlapping = monthOne.concat([
    { fitid: "20240115-0004", date: "2024-01-15", amountCents: -999, payee: "NEW ONE", memo: "", trnType: "DEBIT" },
  ]);
  var existing = new Set(monthOne.map(function (t) { return t.fitid; }));
  var result = dedupeByFitid(overlapping, existing);
  assert.equal(result.length, 1);
  assert.equal(result[0].fitid, "20240115-0004");
});
