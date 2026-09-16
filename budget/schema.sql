-- D1 schema for the budget app. All money is stored as integer cents —
-- never REAL/FLOAT — so the envelope-budgeting math in lib/budget-math.js
-- stays exact. Apply with:
--   wrangler d1 execute daniel-ma-budget --file=schema.sql [--local]

CREATE TABLE accounts (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'credit', 'cash')),
  on_budget INTEGER NOT NULL DEFAULT 1 CHECK (on_budget IN (0, 1)),
  closed INTEGER NOT NULL DEFAULT 0 CHECK (closed IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE category_groups (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  group_id INTEGER NOT NULL REFERENCES category_groups(id),
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  archived INTEGER NOT NULL DEFAULT 0 CHECK (archived IN (0, 1))
);

-- One row per category per month it has an assignment. Rows are additive —
-- assigning twice in the same month should update the existing row, not
-- insert a second one; the API enforces that via UPSERT on this key.
CREATE TABLE monthly_budget (
  category_id INTEGER NOT NULL REFERENCES categories(id),
  month TEXT NOT NULL,               -- 'YYYY-MM'
  assigned_cents INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (category_id, month)
);

CREATE TABLE transactions (
  id INTEGER PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES accounts(id),
  -- Null category_id means either: a transfer (see transfer_account_id),
  -- a split transaction (see transaction_splits), or genuinely uncategorized.
  category_id INTEGER REFERENCES categories(id),
  transfer_account_id INTEGER REFERENCES accounts(id),
  -- The mirror transaction on the other side of a transfer (each transfer
  -- is two rows, one per account, kept in sync and deleted together).
  transfer_pair_id INTEGER REFERENCES transactions(id),
  date TEXT NOT NULL,                -- 'YYYY-MM-DD'
  payee TEXT NOT NULL DEFAULT '',
  memo TEXT NOT NULL DEFAULT '',
  amount_cents INTEGER NOT NULL,     -- negative = outflow, positive = inflow
  cleared INTEGER NOT NULL DEFAULT 0 CHECK (cleared IN (0, 1)),
  is_split INTEGER NOT NULL DEFAULT 0 CHECK (is_split IN (0, 1)),
  -- Set only for transactions imported from a QFX/OFX file; unique per
  -- account so the same file (or an overlapping date range) can be
  -- re-imported without ever creating a duplicate. See lib/qfx-parser.js.
  import_fitid TEXT,
  entered_by TEXT NOT NULL,          -- Cf-Access-Authenticated-User-Email
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE transaction_splits (
  id INTEGER PRIMARY KEY,
  transaction_id INTEGER NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  amount_cents INTEGER NOT NULL
  -- Invariant enforced in the API layer via lib/splits.js, not in SQL:
  -- SUM(amount_cents) for a transaction_id must equal that transaction's
  -- amount_cents.
);

CREATE INDEX idx_txn_account_date ON transactions(account_id, date);
CREATE INDEX idx_txn_category_date ON transactions(category_id, date);
CREATE UNIQUE INDEX idx_txn_import_fitid ON transactions(account_id, import_fitid)
  WHERE import_fitid IS NOT NULL;
CREATE INDEX idx_splits_transaction ON transaction_splits(transaction_id);
CREATE INDEX idx_monthly_budget_month ON monthly_budget(month);
