// Parses QFX/OFX bank exports ("Download to Quicken") into plain
// transaction records. Handles both real-world dialects:
//   - OFX 1.x: SGML, leaf tags usually unclosed (<DTPOSTED>20240102 with no
//     closing tag), preceded by a plain-text header block.
//   - OFX 2.x: well-formed XML with an <?xml?> declaration.
//
// Rather than build a general SGML/XML tree, this exploits the one fact
// that holds in both dialects: aggregate elements (ones that contain other
// elements, like <STMTTRN>) are always explicitly closed, even in SGML —
// only leaf/data elements omit their closing tag. So each transaction block
// can be isolated with a straightforward <STMTTRN>...</STMTTRN> match, and
// each field inside it read up to the next "<".

import { parseCents } from "./money.js";

var STMTTRN_RE = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;

function readField(block, tag) {
  var re = new RegExp("<" + tag + ">([^<\\r\\n]*)", "i");
  var m = re.exec(block);
  return m ? m[1].trim() : null;
}

/** Convert an OFX DTPOSTED value ("20240102120000.000[-5:EST]" or "20240102") to "YYYY-MM-DD". */
function parseOfxDate(raw, context) {
  if (!raw || !/^\d{8}/.test(raw)) {
    throw new Error(`malformed DTPOSTED "${raw}" ${context}`);
  }
  var y = raw.slice(0, 4);
  var mo = raw.slice(4, 6);
  var d = raw.slice(6, 8);
  if (mo < "01" || mo > "12" || d < "01" || d > "31") {
    throw new Error(`malformed DTPOSTED "${raw}" ${context}`);
  }
  return `${y}-${mo}-${d}`;
}

/**
 * Parse raw QFX/OFX file contents into an array of transaction records:
 * { fitid, date, amountCents, payee, memo, trnType }.
 *
 * Throws if a transaction is missing FITID or TRNAMT/DTPOSTED — importing
 * a transaction we can't dedupe or can't date/amount correctly is worse
 * than failing loudly.
 */
export function parseQfx(text) {
  if (typeof text !== "string" || text.trim() === "") {
    throw new Error("empty QFX/OFX file");
  }

  var transactions = [];
  var match;
  STMTTRN_RE.lastIndex = 0;
  var i = 0;
  while ((match = STMTTRN_RE.exec(text)) !== null) {
    var block = match[1];
    i += 1;
    var context = `(transaction #${i} in file)`;

    var fitid = readField(block, "FITID");
    if (!fitid) throw new Error(`missing FITID ${context} — cannot safely dedupe on import`);

    var dtposted = readField(block, "DTPOSTED");
    var date = parseOfxDate(dtposted, context);

    var trnamt = readField(block, "TRNAMT");
    if (trnamt === null) throw new Error(`missing TRNAMT ${context}`);
    var amountCents;
    try {
      amountCents = parseCents(trnamt);
    } catch (e) {
      throw new Error(`malformed TRNAMT "${trnamt}" ${context}: ${e.message}`);
    }

    var payee = readField(block, "NAME") || readField(block, "PAYEE") || "";
    var memo = readField(block, "MEMO") || "";
    var trnType = readField(block, "TRNTYPE") || "";

    transactions.push({
      fitid: fitid,
      date: date,
      amountCents: amountCents,
      payee: payee,
      memo: memo,
      trnType: trnType,
    });
  }
  return transactions;
}

/**
 * Filter a batch of parsed transactions down to ones not already imported,
 * using FITID as the dedup key (per the OFX spec, FITID is meant to be a
 * permanent, unique-per-account identifier for a transaction — re-importing
 * an overlapping date range should never create duplicates).
 *
 * `existingFitids` is an iterable of FITIDs already stored for the account.
 * Also drops duplicate FITIDs within the batch itself, keeping the first.
 */
export function dedupeByFitid(transactions, existingFitids) {
  var seen = new Set(existingFitids);
  var result = [];
  transactions.forEach(function (t) {
    if (seen.has(t.fitid)) return;
    seen.add(t.fitid);
    result.push(t);
  });
  return result;
}
