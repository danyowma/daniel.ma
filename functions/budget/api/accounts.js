import { json, errorResponse } from "../../_shared/respond.js";
import { getUserEmail, AuthError } from "../../_shared/auth.js";

export async function onRequestGet(context) {
  try {
    getUserEmail(context.request);
    var db = context.env.BUDGET_DB;
    var { results } = await db
      .prepare(
        `SELECT a.id, a.name, a.type, a.on_budget, a.closed,
                COALESCE(SUM(t.amount_cents), 0) AS balance_cents
         FROM accounts a
         LEFT JOIN transactions t ON t.account_id = a.id
         WHERE a.closed = 0
         GROUP BY a.id
         ORDER BY a.name`
      )
      .all();
    return json(results);
  } catch (err) {
    return errorResponse(err, err instanceof AuthError ? 401 : 400);
  }
}

export async function onRequestPost(context) {
  try {
    getUserEmail(context.request);
    var body = await context.request.json();
    if (!body.name || typeof body.name !== "string") {
      throw new Error("name is required");
    }
    if (!["checking", "savings", "credit", "cash"].includes(body.type)) {
      throw new Error("type must be one of checking, savings, credit, cash");
    }
    var db = context.env.BUDGET_DB;
    var onBudget = body.on_budget === false ? 0 : 1;
    var result = await db
      .prepare(`INSERT INTO accounts (name, type, on_budget) VALUES (?, ?, ?) RETURNING id`)
      .bind(body.name, body.type, onBudget)
      .first();
    return json({ id: result.id, name: body.name, type: body.type, on_budget: onBudget, balance_cents: 0 }, 201);
  } catch (err) {
    return errorResponse(err, err instanceof AuthError ? 401 : 400);
  }
}
