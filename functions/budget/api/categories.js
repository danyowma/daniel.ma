import { json, errorResponse } from "../../_shared/respond.js";
import { getUserEmail, AuthError } from "../../_shared/auth.js";

export async function onRequestGet(context) {
  try {
    getUserEmail(context.request);
    var db = context.env.BUDGET_DB;
    var groups = (await db
      .prepare(`SELECT id, name, sort_order FROM category_groups ORDER BY sort_order, name`)
      .all()).results;
    var categories = (await db
      .prepare(
        `SELECT id, group_id, name, sort_order FROM categories
         WHERE archived = 0 ORDER BY sort_order, name`
      )
      .all()).results;

    var byGroup = new Map(groups.map(function (g) { return [g.id, { ...g, categories: [] }]; }));
    categories.forEach(function (c) {
      var g = byGroup.get(c.group_id);
      if (g) g.categories.push(c);
    });
    return json(Array.from(byGroup.values()));
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
    var db = context.env.BUDGET_DB;
    var groupId = body.group_id;

    if (!groupId) {
      if (!body.group_name) throw new Error("group_id or group_name is required");
      var groupRow = await db
        .prepare(`INSERT INTO category_groups (name, sort_order) VALUES (?, 0) RETURNING id`)
        .bind(body.group_name)
        .first();
      groupId = groupRow.id;
    }

    var result = await db
      .prepare(
        `INSERT INTO categories (group_id, name, sort_order) VALUES (?, ?, ?) RETURNING id`
      )
      .bind(groupId, body.name, body.sort_order || 0)
      .first();
    return json({ id: result.id, group_id: groupId, name: body.name }, 201);
  } catch (err) {
    return errorResponse(err, err instanceof AuthError ? 401 : 400);
  }
}
