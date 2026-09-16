import { formatCents, parseCents } from "./lib/money.js";

(function () {
  "use strict";

  var API = "/budget/api";

  var state = {
    tab: "accounts",
    accounts: [],
    categoryGroups: [],
    currentAccountId: null,
    transactions: [],
    month: new Date().toISOString().slice(0, 7),
    budget: null,
  };

  var els = {
    pageTitle: document.getElementById("pageTitle"),
    viewAccounts: document.getElementById("viewAccounts"),
    viewRegister: document.getElementById("viewRegister"),
    viewBudget: document.getElementById("viewBudget"),
    viewImport: document.getElementById("viewImport"),
    accountList: document.getElementById("accountList"),
    addAccountBtn: document.getElementById("addAccountBtn"),
    backToAccounts: document.getElementById("backToAccounts"),
    registerAccountName: document.getElementById("registerAccountName"),
    registerBalance: document.getElementById("registerBalance"),
    quickAddForm: document.getElementById("quickAddForm"),
    txnDate: document.getElementById("txnDate"),
    txnPayee: document.getElementById("txnPayee"),
    txnAmount: document.getElementById("txnAmount"),
    txnCategory: document.getElementById("txnCategory"),
    txnTransfer: document.getElementById("txnTransfer"),
    txnCleared: document.getElementById("txnCleared"),
    txnList: document.getElementById("txnList"),
    prevMonth: document.getElementById("prevMonth"),
    nextMonth: document.getElementById("nextMonth"),
    monthLabel: document.getElementById("monthLabel"),
    readyToAssign: document.getElementById("readyToAssign"),
    categoryGroups: document.getElementById("categoryGroups"),
    importAccount: document.getElementById("importAccount"),
    importFile: document.getElementById("importFile"),
    importBtn: document.getElementById("importBtn"),
    importResult: document.getElementById("importResult"),
    tabs: Array.prototype.slice.call(document.querySelectorAll(".tab")),
  };

  function api(path, opts) {
    return fetch(API + path, Object.assign({ credentials: "same-origin" }, opts))
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.error || "request failed");
          return data;
        });
      });
  }

  function money(cents) {
    return "$" + formatCents(cents);
  }

  function amountClass(cents) {
    return cents < 0 ? "negative" : "positive";
  }

  // ---- tabs ----

  function showTab(tab) {
    state.tab = tab;
    els.viewAccounts.hidden = tab !== "accounts" || els.viewRegister.dataset.open === "true";
    els.viewRegister.hidden = true;
    els.viewBudget.hidden = tab !== "budget";
    els.viewImport.hidden = tab !== "import";
    els.tabs.forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.tab === tab);
    });
    var titles = { accounts: "Accounts", budget: "Budget", import: "Import" };
    els.pageTitle.textContent = titles[tab];
    if (tab === "budget") loadBudget();
    if (tab === "import") renderImportAccounts();
  }

  els.tabs.forEach(function (btn) {
    btn.addEventListener("click", function () { showTab(btn.dataset.tab); });
  });

  // ---- accounts ----

  function loadAccounts() {
    return api("/accounts").then(function (accounts) {
      state.accounts = accounts;
      renderAccounts();
    });
  }

  function renderAccounts() {
    els.accountList.innerHTML = "";
    state.accounts.forEach(function (a) {
      var li = document.createElement("li");
      li.innerHTML =
        '<span>' + a.name + '</span><span class="amount ' + amountClass(a.balance_cents) + '">' +
        money(a.balance_cents) + "</span>";
      li.addEventListener("click", function () { openRegister(a); });
      els.accountList.appendChild(li);
    });
  }

  els.addAccountBtn.addEventListener("click", function () {
    var name = prompt("Account name?");
    if (!name) return;
    var type = prompt("Type (checking, savings, credit, cash)?", "checking");
    if (!type) return;
    api("/accounts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: name, type: type }) })
      .then(loadAccounts)
      .catch(function (err) { alert(err.message); });
  });

  // ---- register ----

  function openRegister(account) {
    state.currentAccountId = account.id;
    els.viewAccounts.hidden = true;
    els.viewRegister.hidden = false;
    els.viewRegister.dataset.open = "true";
    els.registerAccountName.textContent = account.name;
    els.registerBalance.textContent = money(account.balance_cents);
    els.registerBalance.className = "balance amount " + amountClass(account.balance_cents);
    els.txnDate.value = new Date().toISOString().slice(0, 10);

    populateCategorySelect(els.txnCategory);
    populateTransferSelect(account.id);
    loadTransactions(account.id);
  }

  els.backToAccounts.addEventListener("click", function () {
    els.viewRegister.dataset.open = "false";
    showTab("accounts");
    loadAccounts();
  });

  function populateCategorySelect(select) {
    select.innerHTML = '<option value="">Uncategorized</option>';
    state.categoryGroups.forEach(function (g) {
      var optgroup = document.createElement("optgroup");
      optgroup.label = g.name;
      g.categories.forEach(function (c) {
        var opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.name;
        optgroup.appendChild(opt);
      });
      select.appendChild(optgroup);
    });
  }

  function populateTransferSelect(currentAccountId) {
    els.txnTransfer.innerHTML = '<option value="">Not a transfer</option>';
    state.accounts.forEach(function (a) {
      if (a.id === currentAccountId) return;
      var opt = document.createElement("option");
      opt.value = a.id;
      opt.textContent = "Transfer to " + a.name;
      els.txnTransfer.appendChild(opt);
    });
  }

  function loadTransactions(accountId) {
    return api("/transactions?account_id=" + accountId).then(function (txns) {
      state.transactions = txns;
      renderTransactions();
    });
  }

  function renderTransactions() {
    els.txnList.innerHTML = "";
    state.transactions.forEach(function (t) {
      var li = document.createElement("li");
      var label = t.payee || (t.transfer_account_id ? "Transfer" : "");
      li.innerHTML =
        '<span>' + t.date + " &middot; " + label + '</span><span class="amount ' +
        amountClass(t.amount_cents) + '">' + money(t.amount_cents) + "</span>";
      els.txnList.appendChild(li);
    });
  }

  els.txnTransfer.addEventListener("change", function () {
    els.txnCategory.disabled = !!els.txnTransfer.value;
  });

  els.quickAddForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var amountCents;
    try {
      amountCents = parseCents(els.txnAmount.value);
    } catch (err) {
      alert("Amount looks wrong: " + err.message);
      return;
    }
    var body = {
      account_id: state.currentAccountId,
      date: els.txnDate.value,
      payee: els.txnPayee.value,
      amount_cents: amountCents,
      cleared: els.txnCleared.checked,
    };
    if (els.txnTransfer.value) {
      body.transfer_account_id = Number(els.txnTransfer.value);
    } else if (els.txnCategory.value) {
      body.category_id = Number(els.txnCategory.value);
    }

    api("/transactions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) })
      .then(function () {
        els.quickAddForm.reset();
        els.txnDate.value = new Date().toISOString().slice(0, 10);
        return loadAccounts().then(function () {
          var acct = state.accounts.find(function (a) { return a.id === state.currentAccountId; });
          if (acct) {
            els.registerBalance.textContent = money(acct.balance_cents);
            els.registerBalance.className = "balance amount " + amountClass(acct.balance_cents);
          }
          return loadTransactions(state.currentAccountId);
        });
      })
      .catch(function (err) { alert(err.message); });
  });

  // ---- categories ----

  function loadCategories() {
    return api("/categories").then(function (groups) {
      state.categoryGroups = groups;
    });
  }

  // ---- budget ----

  function shiftMonth(month, delta) {
    var y = Number(month.slice(0, 4));
    var m = Number(month.slice(5, 7)) - 1 + delta;
    y += Math.floor(m / 12);
    m = ((m % 12) + 12) % 12;
    return y + "-" + String(m + 1).padStart(2, "0");
  }

  function loadBudget() {
    els.monthLabel.textContent = state.month;
    return api("/budget?month=" + state.month).then(function (data) {
      state.budget = data;
      renderBudget();
    });
  }

  function renderBudget() {
    var data = state.budget;
    els.readyToAssign.textContent = "Ready to Assign: " + money(data.ready_to_assign_cents);
    els.readyToAssign.className = "ready-to-assign amount " + amountClass(data.ready_to_assign_cents);

    var byCategory = new Map(data.categories.map(function (c) { return [c.category_id, c]; }));
    els.categoryGroups.innerHTML = "";
    state.categoryGroups.forEach(function (g) {
      var section = document.createElement("div");
      section.className = "category-group";
      var h3 = document.createElement("h3");
      h3.textContent = g.name;
      section.appendChild(h3);

      g.categories.forEach(function (c) {
        var row = document.createElement("div");
        row.className = "category-row";
        var summary = byCategory.get(c.id) || { assigned_cents: 0, available_cents: 0 };

        var name = document.createElement("span");
        name.className = "cat-name";
        name.textContent = c.name;

        var assignWrap = document.createElement("span");
        assignWrap.className = "cat-assign";
        var input = document.createElement("input");
        input.type = "text";
        input.inputMode = "decimal";
        input.value = formatCents(summary.assigned_cents);
        input.addEventListener("change", function () {
          assignToCategory(c.id, input.value);
        });
        assignWrap.appendChild(input);

        var available = document.createElement("span");
        available.className = "cat-available amount " + amountClass(summary.available_cents);
        available.textContent = money(summary.available_cents);

        row.appendChild(name);
        row.appendChild(assignWrap);
        row.appendChild(available);
        section.appendChild(row);
      });

      els.categoryGroups.appendChild(section);
    });
  }

  function assignToCategory(categoryId, amountStr) {
    var assignedCents;
    try {
      assignedCents = parseCents(amountStr);
    } catch (err) {
      alert("Amount looks wrong: " + err.message);
      return;
    }
    api("/budget", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ category_id: categoryId, month: state.month, assigned_cents: assignedCents }),
    })
      .then(loadBudget)
      .catch(function (err) { alert(err.message); });
  }

  els.prevMonth.addEventListener("click", function () {
    state.month = shiftMonth(state.month, -1);
    loadBudget();
  });
  els.nextMonth.addEventListener("click", function () {
    state.month = shiftMonth(state.month, 1);
    loadBudget();
  });

  // ---- import ----

  function renderImportAccounts() {
    els.importAccount.innerHTML = "";
    state.accounts.forEach(function (a) {
      var opt = document.createElement("option");
      opt.value = a.id;
      opt.textContent = a.name;
      els.importAccount.appendChild(opt);
    });
  }

  els.importBtn.addEventListener("click", function () {
    var file = els.importFile.files[0];
    if (!file) { alert("Choose a QFX/OFX file first."); return; }
    var accountId = Number(els.importAccount.value);
    if (!accountId) { alert("Choose an account first."); return; }

    file.text().then(function (text) {
      return api("/import-qfx", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ account_id: accountId, qfx_text: text }),
      });
    })
      .then(function (result) {
        els.importResult.textContent =
          "Imported " + result.imported + " of " + result.parsed + " transactions (" +
          result.skipped + " already on file).";
        return loadAccounts();
      })
      .catch(function (err) {
        els.importResult.textContent = "Import failed: " + err.message;
      });
  });

  // ---- boot ----

  Promise.all([loadAccounts(), loadCategories()]).then(function () {
    showTab("accounts");
  });
})();
