import { json, errorResponse } from "../../_shared/respond.js";
import { getUserEmail, AuthError } from "../../_shared/auth.js";
import { parseQfx, dedupeByFitid } from "../../../budget/lib/qfx-parser.js";

export async function onRequestPost(context) {
  try {
    var email = getUserEmail(context.request);
    var body = await context.request.json();
    if (!body.account_id) throw new Error("account_id is required");
    if (!body.qfx_text) throw new Error("qfx_text is required");

    var db = context.env.BUDGET_DB;
    var parsed = parseQfx(body.qfx_text);

    var { results: existingRows } = await db
      .prepare(`SELECT import_fitid FROM transactions WHERE account_id = ? AND import_fitid IS NOT NULL`)
      .bind(body.account_id)
      .all();
    var existingFitids = existingRows.map(function (r) { return r.import_fitid; });

    var newTxns = dedupeByFitid(parsed, existingFitids);

    if (newTxns.length) {
      await db.batch(
        newTxns.map(function (t) {
          return db
            .prepare(
              `INSERT INTO transactions (account_id, date, payee, memo, amount_cents, cleared, import_fitid, entered_by)
               VALUES (?, ?, ?, ?, ?, 1, ?, ?)`
            )
            .bind(body.account_id, t.date, t.payee, t.memo, t.amountCents, t.fitid, email);
        })
      );
    }

    return json({ parsed: parsed.length, imported: newTxns.length, skipped: parsed.length - newTxns.length });
  } catch (err) {
    return errorResponse(err, err instanceof AuthError ? 401 : 400);
  }
}
