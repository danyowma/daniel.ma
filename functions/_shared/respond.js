export function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { "content-type": "application/json" },
  });
}

/** Convert a thrown error into a 400 JSON response — used for validation
 * failures from the lib/ modules (bad month keys, unbalanced splits, etc). */
export function errorResponse(err, status) {
  return json({ error: err instanceof Error ? err.message : String(err) }, status || 400);
}
