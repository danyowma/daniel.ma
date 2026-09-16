import { json, errorResponse } from "../../../_shared/respond.js";
import { getUserEmail, AuthError } from "../../../_shared/auth.js";
import { validateSplits } from "../../../../budget/lib/splits.js";

async function loadTransaction(db, id) {
  return db.prepare(`SELECT * FROM transactions WHERE id = ?`).bind(id).first();
}

export async function onRequestGet(context) {
  try {
    getUserEmail(context.request);
    var db = context.env.BUDGET_DB;
    var txn = await loadTransaction(db, context.params.id);
    if (!txn) return json({ error: "not found" }, 404);
    if (txn.is_split) {
      var { results } = await db
        .prepare(`SELECT id, category_id, amount_cents FROM transaction_splits WHERE transaction_id = ?`)
        .bind(txn.id)
        .all();
      txn.splits = results;
    }
    return json(txn);
  } catch (err) {
    return errorResponse(err, err instanceof AuthError ? 401 : 400);
  }
}

export async function onRequestPatch(context) {
  try {
    getUserEmail(context.request);
    var db = context.env.BUDGET_DB;
    var id = context.params.id;
    var existing = await loadTransaction(db, id);
    if (!existing) return json({ error: "not found" }, 404);
    if (existing.transfer_pair_id) {
      throw new Error("editing a transfer directly isn't supported — delete and re-create it");
    }

    var body = await context.request.json();
    var amountCents = Number.isInteger(body.amount_cents) ? body.amount_cents : existing.amount_cents;

    if (body.splits) {
      validateSplits(body.splits, amountCents);
    }

    var fields = {
      date: body.date !== undefined ? body.date : existing.date,
      payee: body.payee !== undefined ? body.payee : existing.payee,
      memo: body.memo !== undefined ? body.memo : existing.memo,
      amount_cents: amountCents,
      category_id: body.splits ? null : (body.category_id !== undefined ? body.category_id : existing.category_id),
      cleared: body.cleared !== undefined ? (body.cleared ? 1 : 0) : existing.cleared,
      is_split: body.splits ? 1 : existing.is_split,
    };

    await db
      .prepare(
        `UPDATE transactions SET date = ?, payee = ?, memo = ?, amount_cents = ?, category_id = ?, cleared = ?, is_split = ?
         WHERE id = ?`
      )
      .bind(fields.date, fields.payee, fields.memo, fields.amount_cents, fields.category_id, fields.cleared, fields.is_split, id)
      .run();

    if (body.splits) {
      await db.prepare(`DELETE FROM transaction_splits WHERE transaction_id = ?`).bind(id).run();
      await db.batch(
        body.splits.map(function (s) {
          return db
            .prepare(`INSERT INTO transaction_splits (transaction_id, category_id, amount_cents) VALUES (?, ?, ?)`)
            .bind(id, s.categoryId, s.amountCents);
        })
      );
    }

    return json({ id: Number(id), ...fields });
  } catch (err) {
    return errorResponse(err, err instanceof AuthError ? 401 : 400);
  }
}

export async function onRequestDelete(context) {
  try {
    getUserEmail(context.request);
    var db = context.env.BUDGET_DB;
    var id = context.params.id;
    var existing = await loadTransaction(db, id);
    if (!existing) return json({ error: "not found" }, 404);

    // A transfer is two rows kept in sync — delete both so the register
    // never shows a one-sided transfer.
    if (existing.transfer_pair_id) {
      await db.batch([
        db.prepare(`DELETE FROM transactions WHERE id = ?`).bind(id),
        db.prepare(`DELETE FROM transactions WHERE id = ?`).bind(existing.transfer_pair_id),
      ]);
    } else {
      await db.prepare(`DELETE FROM transaction_splits WHERE transaction_id = ?`).bind(id).run();
      await db.prepare(`DELETE FROM transactions WHERE id = ?`).bind(id).run();
    }

    return json({ deleted: true });
  } catch (err) {
    return errorResponse(err, err instanceof AuthError ? 401 : 400);
  }
}
