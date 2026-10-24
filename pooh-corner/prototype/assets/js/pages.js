/* Page-specific behaviour: icons, simulated forms, shop listing, product detail, visit hours. */
(function () {
  "use strict";
  var PC = window.PC, $ = PC.$, $all = PC.$all, esc = PC.esc, money = PC.money, img = PC.img;
  var PRODUCTS = window.PRODUCTS || [];
  var INFO = window.SITE_INFO;

  // Inline icons for [data-icon]
  $all("[data-icon]").forEach(function (el) {
    var svg = window.ICONS[el.getAttribute("data-icon")];
    if (svg) el.outerHTML = svg;
  });

  // Forms that are deliberately not connected
  $all(".js-sim-form").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      window.toast("Thanks — this is a prototype", "In the live site this would connect to the existing newsletter.");
      f.reset();
    });
  });

  // Collection cover images borrowed from a representative product
  $all("img[data-cover]").forEach(function (im) {
    var p = PRODUCTS.filter(function (x) { return x.handle === im.getAttribute("data-cover"); })[0];
    if (p) { im.src = img(p.images[0], 600); }
  });

  var page = document.body.getAttribute("data-page");

  // ---------- Visit page: hours table ----------
  if (page === "visit") {
    var day = new Date().getDay();
    $all(".hours-table tr[data-day]").forEach(function (tr) {
      if (tr.getAttribute("data-day").split(",").indexOf(String(day)) !== -1) tr.classList.add("today");
    });
  }

  // ---------- Shop listing ----------
  if (page === "shop") {
    var grid = $("#shop-grid"), countEl = $("#result-count"), q = $("#shop-search"), sortSel = $("#sort"), budgetSel = $("#budget");
    var params = new URLSearchParams(location.search);
    var state = { cat: params.get("cat") || "all", budget: params.get("budget") || "any", q: params.get("q") || "", sort: "featured" };
    if (q) q.value = state.q;
    if (budgetSel) budgetSel.value = state.budget;

    function matches(p) {
      if (state.cat === "centenary" && !p.centenary) return false;
      if (state.cat !== "all" && state.cat !== "centenary" && p.category !== state.cat) return false;
      if (state.budget === "10" && p.price >= 10) return false;
      if (state.budget === "30" && p.price >= 30) return false;
      if (state.budget === "30plus" && p.price < 30) return false;
      if (state.q) {
        var hay = (p.title + " " + p.type + " " + (window.CAT_LABELS[p.category] || "")).toLowerCase();
        if (state.q.toLowerCase().split(/\s+/).some(function (w) { return w && hay.indexOf(w) === -1; })) return false;
      }
      return true;
    }
    function render() {
      var list = PRODUCTS.filter(matches);
      if (state.sort === "low") list.sort(function (a, b) { return a.price - b.price; });
      if (state.sort === "high") list.sort(function (a, b) { return b.price - a.price; });
      if (state.sort === "az") list.sort(function (a, b) { return a.title.localeCompare(b.title); });
      grid.innerHTML = list.length ? list.map(window.productCard).join("") :
        '<div class="empty" style="grid-column:1/-1"><h3>Nothing quite matches</h3><p>Try a different search or <button class="chip js-reset" type="button">clear filters</button></p></div>';
      countEl.textContent = list.length + (list.length === 1 ? " gift" : " gifts");
      $all(".chip[data-cat]").forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-cat") === state.cat)); });
      var title = $("#listing-title");
      if (title) title.textContent = state.cat === "all" ? "All gifts" : (window.CAT_LABELS[state.cat] || "Gifts");
      var r = $(".js-reset", grid);
      if (r) r.addEventListener("click", reset);
      var u = new URLSearchParams();
      if (state.cat !== "all") u.set("cat", state.cat);
      if (state.budget !== "any") u.set("budget", state.budget);
      if (state.q) u.set("q", state.q);
      history.replaceState(null, "", location.pathname + (u.toString() ? "?" + u : "") + location.hash);
    }
    function reset() { state.cat = "all"; state.budget = "any"; state.q = ""; q.value = ""; budgetSel.value = "any"; render(); }

    $all(".chip[data-cat]").forEach(function (c) {
      c.addEventListener("click", function () { state.cat = c.getAttribute("data-cat"); render(); });
    });
    $all("[data-goto-cat]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault(); state.cat = a.getAttribute("data-goto-cat"); render();
        $("#listing").scrollIntoView({ behavior: "smooth" });
      });
    });
    q.addEventListener("input", function () { state.q = q.value.trim(); render(); });
    $("#search-form").addEventListener("submit", function (e) { e.preventDefault(); $("#listing").scrollIntoView({ behavior: "smooth" }); });
    sortSel.addEventListener("change", function () { state.sort = sortSel.value; render(); });
    budgetSel.addEventListener("change", function () { state.budget = budgetSel.value; render(); });
    render();
    if (location.hash === "#search") setTimeout(function () { q.focus(); }, 50);
    if (params.toString()) setTimeout(function () { $("#listing").scrollIntoView(); }, 50);
  }

  // ---------- Product detail ----------
  if (page === "product") {
    var handle = new URLSearchParams(location.search).get("p") || "winnie-the-pooh-100-commemorative-soft-toy";
    var p = PRODUCTS.filter(function (x) { return x.handle === handle; })[0] || PRODUCTS[0];
    document.title = p.title + " — Pooh Corner (concept)";
    var catLabel = window.CAT_LABELS[p.category];

    $("#crumb").innerHTML = '<a href="index.html">Home</a><span>/</span><a href="shop.html">Shop</a><span>/</span><a href="shop.html?cat=' + p.category + '">' + esc(catLabel) + "</a>";

    var thumbs = p.images.map(function (u, i) {
      return '<button type="button" data-i="' + i + '" aria-label="Show image ' + (i + 1) + '"' + (i === 0 ? ' aria-current="true"' : "") + '><img src="' + img(u, 160) + '" alt=""></button>';
    }).join("");
    $("#gallery").innerHTML = '<div class="gallery-main"><img id="main-img" src="' + img(p.images[0], 1200) + '" alt="' + esc(p.title) + '"></div>' + (p.images.length > 1 ? '<div class="thumbs">' + thumbs + "</div>" : "");
    $all("#gallery .thumbs button").forEach(function (b) {
      b.addEventListener("click", function () {
        $("#main-img").src = img(p.images[+b.getAttribute("data-i")], 1200);
        $all("#gallery .thumbs button").forEach(function (x) { x.removeAttribute("aria-current"); });
        b.setAttribute("aria-current", "true");
      });
    });

    var left = INFO.freeShipping - p.price;
    var pct = Math.min(100, Math.round(p.price / INFO.freeShipping * 100));
    var details = p.details.length ? "<ul>" + p.details.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul>" : "<p>Full product details as listed on the current shop.</p>";

    $("#pdp-info").innerHTML =
      '<p class="eyebrow">' + esc(catLabel) + (p.centenary ? " · 100th anniversary" : "") + "</p>" +
      "<h1>" + esc(p.title) + "</h1>" +
      '<p class="pdp-price">' + money(p.price) + (p.compareAt ? "<s>" + money(p.compareAt) + "</s>" : "") + "</p>" +
      '<p class="small muted">Tax included. Delivery calculated at checkout.</p>' +
      '<p class="lead" style="font-size:1.05rem">' + esc(p.description) + "</p>" +
      '<div class="buy-row"><div class="qty" aria-label="Quantity"><button type="button" class="js-minus" aria-label="Decrease quantity">−</button><output class="js-qty" aria-live="polite">1</output><button type="button" class="js-plus" aria-label="Increase quantity">+</button></div>' +
      '<button class="btn btn--primary js-add" type="button">Add to basket</button></div>' +
      '<div class="free-ship">' + (left > 0 ? "Add " + money(left) + " more for <strong>free UK delivery</strong>" : "This qualifies for <strong>free UK delivery</strong>") +
      '<div class="bar"><i style="width:' + pct + '%"></i></div></div>' +
      "<details open><summary>Product details</summary><div>" + details + "</div></details>" +
      "<details><summary>Delivery &amp; collection</summary><div><ul>" +
        "<li>UK orders are usually dispatched within 48 hours and arrive within 3 working days by Royal Mail.</li>" +
        "<li>Free UK delivery on orders over £30.</li>" +
        "<li>International orders are sent tracked.</li>" +
        "<li>Collect in store from Pooh Corner, Hartfield, at checkout.</li></ul></div></details>" +
      "<details><summary>Gift wrapping</summary><div><p>Our team can gift wrap your order. Details and pricing are shown at checkout on the live shop.</p></div></details>" +
      '<p class="sim-note" style="margin-top:20px">' + window.ICONS.info + '<span>Prototype: the basket is simulated. Product details and price are taken from the <a href="' + p.url + '" rel="noopener">current listing</a>.</span></p>';

    var qty = 1, out = $(".js-qty");
    $(".js-minus").addEventListener("click", function () { qty = Math.max(1, qty - 1); out.textContent = qty; });
    $(".js-plus").addEventListener("click", function () { qty = Math.min(9, qty + 1); out.textContent = qty; });
    $(".js-add").addEventListener("click", function () { window.addToBasket(p.handle, qty); });

    var related = PRODUCTS.filter(function (x) { return x.handle !== p.handle && x.category === p.category; });
    if (related.length < 4) related = related.concat(PRODUCTS.filter(function (x) { return x.handle !== p.handle && x.category !== p.category && x.centenary === p.centenary && related.indexOf(x) === -1; }));
    $("#related").innerHTML = related.slice(0, 4).map(window.productCard).join("");
  }
})();
