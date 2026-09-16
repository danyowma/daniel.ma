import { json, errorResponse } from "../../_shared/respond.js";
import { getUserEmail, AuthError } from "../../_shared/auth.js";
import { validateMonthKey, categoryAvailableCents, readyToAssignCents } from "../../../budget/lib/budget-math.js";

// Per-category, per-month net activity, combining plain transactions with
// split-transaction lines (a split parent has category_id = NULL so it
// never double-counts against the UNION ALL below).
var ACTIVITY_SQL = `
  SELECT category_id, substr(date, 1, 7) AS month, SUM(amount_cents) AS net_cents
  FROM transactions
  WHERE category_id IS NOT NULL AND is_split = 0
  GROUP BY category_id, month

  UNION ALL

  SELECT s.category_id, substr(t.date, 1, 7) AS month, SUM(s.amount_cents) AS net_cents
  FROM transaction_splits s
  JOIN transactions t ON t.id = s.transaction_id
  GROUP BY s.category_id, month
`;

export async function onRequestGet(context) {
  try {
    getUserEmail(context.request);
    var url = new URL(context.request.url);
    var month = url.searchParams.get("month");
    if (!month) throw new Error("month query param is required (YYYY-MM)");
    validateMonthKey(month);

    var db = context.env.BUDGET_DB;

    var categories = (await db
      .prepare(`SELECT id, group_id, name FROM categories WHERE archived = 0`)
      .all()).results;

    var assignedRows = (await db
      .prepare(`SELECT category_id, month, assigned_cents FROM monthly_budget`)
      .all()).results;

    var activityRows = (await db.prepare(ACTIVITY_SQL).all()).results;

    var assignedByCategory = new Map();
    assignedRows.forEach(function (r) {
      var list = assignedByCategory.get(r.category_id) || [];
      list.push({ month: r.month, assignedCents: r.assigned_cents });
      assignedByCategory.set(r.category_id, list);
    });
    var spentByCategory = new Map();
    activityRows.forEach(function (r) {
      var list = spentByCategory.get(r.category_id) || [];
      list.push({ month: r.month, spentCents: -r.net_cents });
      spentByCategory.set(r.category_id, list);
    });

    var categoryResults = categories.map(function (c) {
      var entries = (assignedByCategory.get(c.id) || []).concat(spentByCategory.get(c.id) || []);
      var assignedThisMonth = (assignedByCategory.get(c.id) || [])
        .filter(function (e) { return e.month === month; })
        .reduce(function (sum, e) { return sum + e.assignedCents; }, 0);
      var spentThisMonth = (spentByCategory.get(c.id) || [])
        .filter(function (e) { return e.month === month; })
        .reduce(function (sum, e) { return sum + e.spentCents; }, 0);
      return {
        category_id: c.id,
        group_id: c.group_id,
        name: c.name,
        assigned_cents: assignedThisMonth,
        spent_cents: spentThisMonth,
        available_cents: categoryAvailableCents(entries, month),
      };
    });

    var onBudgetBalance = await db
      .prepare(
        `SELECT COALESCE(SUM(t.amount_cents), 0) AS total
         FROM transactions t JOIN accounts a ON a.id = t.account_id
         WHERE a.on_budget = 1 AND a.closed = 0`
      )
      .first();

    var readyToAssign = readyToAssignCents(
      onBudgetBalance.total,
      assignedRows.map(function (r) { return { assignedCents: r.assigned_cents }; })
    );

    return json({ month: month, ready_to_assign_cents: readyToAssign, categories: categoryResults });
  } catch (err) {
    return errorResponse(err, err instanceof AuthError ? 401 : 400);
  }
}

export async function onRequestPost(context) {
  try {
    getUserEmail(context.request);
    var body = await context.request.json();
    validateMonthKey(body.month);
    if (!body.category_id) throw new Error("category_id is required");
    if (!Number.isInteger(body.assigned_cents)) throw new Error("assigned_cents must be an integer");

    var db = context.env.BUDGET_DB;
    await db
      .prepare(
        `INSERT INTO monthly_budget (category_id, month, assigned_cents) VALUES (?, ?, ?)
         ON CONFLICT (category_id, month) DO UPDATE SET assigned_cents = excluded.assigned_cents`
      )
      .bind(body.category_id, body.month, body.assigned_cents)
      .run();

    return json({ category_id: body.category_id, month: body.month, assigned_cents: body.assigned_cents });
  } catch (err) {
    return errorResponse(err, err instanceof AuthError ? 401 : 400);
  }
}
