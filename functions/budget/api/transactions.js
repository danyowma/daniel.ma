import { json, errorResponse } from "../../_shared/respond.js";
import { getUserEmail, AuthError } from "../../_shared/auth.js";
import { validateSplits } from "../../../budget/lib/splits.js";

export async function onRequestGet(context) {
  try {
    getUserEmail(context.request);
    var url = new URL(context.request.url);
    var db = context.env.BUDGET_DB;

    var clauses = [];
    var params = [];
    var accountId = url.searchParams.get("account_id");
    var categoryId = url.searchParams.get("category_id");
    var from = url.searchParams.get("from");
    var to = url.searchParams.get("to");
    if (accountId) { clauses.push("account_id = ?"); params.push(accountId); }
    if (categoryId) { clauses.push("category_id = ?"); params.push(categoryId); }
    if (from) { clauses.push("date >= ?"); params.push(from); }
    if (to) { clauses.push("date <= ?"); params.push(to); }
    var where = clauses.length ? "WHERE " + clauses.join(" AND ") : "";
    var limit = Math.min(parseInt(url.searchParams.get("limit"), 10) || 200, 1000);

    var stmt = db
      .prepare(
        `SELECT id, account_id, category_id, transfer_account_id, transfer_pair_id,
                date, payee, memo, amount_cents, cleared, is_split, import_fitid, entered_by
         FROM transactions ${where}
         ORDER BY date DESC, id DESC
         LIMIT ?`
      )
      .bind(...params, limit);
    var { results: txns } = await stmt.all();

    var splitIds = txns.filter(function (t) { return t.is_split; }).map(function (t) { return t.id; });
    var splitsByTxn = new Map();
    if (splitIds.length) {
      var placeholders = splitIds.map(function () { return "?"; }).join(",");
      var { results: splitRows } = await db
        .prepare(`SELECT id, transaction_id, category_id, amount_cents FROM transaction_splits WHERE transaction_id IN (${placeholders})`)
        .bind(...splitIds)
        .all();
      splitRows.forEach(function (s) {
        var list = splitsByTxn.get(s.transaction_id) || [];
        list.push(s);
        splitsByTxn.set(s.transaction_id, list);
      });
    }

    var out = txns.map(function (t) {
      return t.is_split ? { ...t, splits: splitsByTxn.get(t.id) || [] } : t;
    });
    return json(out);
  } catch (err) {
    return errorResponse(err, err instanceof AuthError ? 401 : 400);
  }
}

export async function onRequestPost(context) {
  try {
    var email = getUserEmail(context.request);
    var body = await context.request.json();
    var db = context.env.BUDGET_DB;

    if (!body.account_id) throw new Error("account_id is required");
    if (!body.date || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) throw new Error("date must be YYYY-MM-DD");
    if (!Number.isInteger(body.amount_cents)) throw new Error("amount_cents must be an integer");

    if (body.splits) {
      validateSplits(body.splits, body.amount_cents);
    }
    if (body.splits && body.transfer_account_id) {
      throw new Error("a transaction cannot be both a split and a transfer");
    }

    var row = await db
      .prepare(
        `INSERT INTO transactions
           (account_id, category_id, transfer_account_id, date, payee, memo, amount_cents, cleared, is_split, entered_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         RETURNING id`
      )
      .bind(
        body.account_id,
        body.splits || body.transfer_account_id ? null : body.category_id || null,
        body.transfer_account_id || null,
        body.date,
        body.payee || "",
        body.memo || "",
        body.amount_cents,
        body.cleared ? 1 : 0,
        body.splits ? 1 : 0,
        email
      )
      .first();

    // D1 can't run these dependent inserts (mirror row needs the parent's
    // just-assigned id) inside one atomic batch, so if a later step fails
    // we explicitly unwind the parent insert rather than leave a
    // half-written split or one-sided transfer sitting in the register.
    try {
      if (body.splits) {
        await db.batch(
          body.splits.map(function (s) {
            return db
              .prepare(`INSERT INTO transaction_splits (transaction_id, category_id, amount_cents) VALUES (?, ?, ?)`)
              .bind(row.id, s.categoryId, s.amountCents);
          })
        );
      }

      var mirrorId = null;
      if (body.transfer_account_id) {
        var mirror = await db
          .prepare(
            `INSERT INTO transactions
               (account_id, transfer_account_id, transfer_pair_id, date, payee, memo, amount_cents, cleared, entered_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
             RETURNING id`
          )
          .bind(
            body.transfer_account_id,
            body.account_id,
            row.id,
            body.date,
            body.payee || "",
            body.memo || "",
            -body.amount_cents,
            body.cleared ? 1 : 0,
            email
          )
          .first();
        mirrorId = mirror.id;
        await db.prepare(`UPDATE transactions SET transfer_pair_id = ? WHERE id = ?`).bind(mirrorId, row.id).run();
      }
    } catch (inner) {
      await db.prepare(`DELETE FROM transactions WHERE id = ?`).bind(row.id).run();
      throw inner;
    }

    return json({ id: row.id, transfer_pair_id: mirrorId }, 201);
  } catch (err) {
    return errorResponse(err, err instanceof AuthError ? 401 : 400);
  }
}
