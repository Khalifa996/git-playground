/* Pooh Corner — independent redesign concept.
   Shared header/footer, opening-hours logic, simulated basket and page renderers.
   Nothing here talks to a real shop: basket and checkout are simulated. */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  // ---------- Verified business facts (from poohcorner.co.uk, 23 Oct 2026) ----------
  var INFO = {
    address: "High Street, Hartfield, East Sussex, TN7 4AE",
    phoneVisit: "07563 627326",
    emailVisit: "info@poohcorner.co.uk",
    phoneShop: "01892 771155",
    emailShop: "shop@poohcorner.co.uk",
    emailTea: "afternoontea@poohcorner.co.uk",
    instagram: "https://www.instagram.com/poohcornerhartfield/",
    shopUrl: "https://shop.poohcorner.co.uk/",
    freeShipping: 30,
    // 0 = Sunday. Hours as published; bank holidays follow Sunday hours.
    hours: { 0: [11, 16], 1: [11, 17], 2: [11, 17], 3: [11, 17], 4: [11, 17], 5: [11, 17], 6: [11, 17] },
    closedDates: ["12-25", "12-26", "01-01", "01-02"]
  };
  window.SITE_INFO = INFO;

  // ---------- Icons ----------
  var I = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 16v-4l2-5h12l2 5v4H4z"/><path d="M4 12h16"/><circle cx="7.5" cy="16.5" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/></svg>',
    cup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 9h13v5a5 5 0 01-5 5H9a5 5 0 01-5-5V9z"/><path d="M17 10h1.5a2.5 2.5 0 010 5H17"/><path d="M8 3c0 1.5 1 1.5 1 3M12 3c0 1.5 1 1.5 1 3"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.5"/><circle cx="17" cy="17.5" r="1.5"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13"/><path d="M12 7c-2-3-5-3-5-1s3 1 5 1zM12 7c2-3 5-3 5-1s-3 1-5 1z"/></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 10v10h16V10M3 10l2-6h14l2 6H3z"/><path d="M10 20v-5h4v5"/></svg>',
    camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    info: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/></svg>'
  };
  window.ICONS = I;

  // ---------- Helpers ----------
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  // Shopify's CDN resizes on the fly with ?width=
  function img(u, w) { return u + (u.indexOf("?") === -1 ? "?" : "&") + "width=" + w; }
  function money(n) { return "£" + n.toFixed(2); }
  function fmtHour(h) { return (h > 12 ? h - 12 : h) + (h >= 12 ? "pm" : "am"); }
  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key) || "null");
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }
  window.PC = { $: $, $all: $all, esc: esc, money: money, img: img };

  // ---------- Opening status ----------
  function todayStatus(now) {
    now = now || new Date();
    var key = String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
    if (INFO.closedDates.indexOf(key) !== -1) return { open: false, label: "Closed today", detail: "We're closed on 25–26 December and 1–2 January" };
    var h = INFO.hours[now.getDay()];
    var t = now.getHours() + now.getMinutes() / 60;
    var range = fmtHour(h[0]) + "–" + fmtHour(h[1]);
    if (t < h[0]) return { open: false, label: "Opens today at " + fmtHour(h[0]), detail: "Open " + range + " today", range: range };
    if (t >= h[1]) return { open: false, label: "Closed for today", detail: "Open " + range + " today", range: range };
    return { open: true, label: "Open today until " + fmtHour(h[1]), detail: "Food service ends around an hour before closing", range: range };
  }
  window.todayStatus = todayStatus;

  // ---------- Header / footer ----------
  var page = document.body.getAttribute("data-page") || "";
  var NAV = [
    ["visit", "visit.html", "Visit"],
    ["tearoom", "visit.html#tearoom", "Tearoom"],
    ["museum", "visit.html#museum", "Museum"],
    ["shop", "shop.html", "Shop"],
    ["story", "story.html", "Our story"]
  ];
  function navLinks() {
    return NAV.map(function (n) {
      var cur = (n[0] === page || (page === "product" && n[0] === "shop")) ? ' aria-current="page"' : "";
      return '<li><a href="' + n[1] + '"' + cur + ">" + n[2] + "</a></li>";
    }).join("");
  }

  var st = todayStatus();
  var headerHTML =
    '<div class="concept-bar">Design concept<span class="long"> by an independent designer</span> — not the official Pooh Corner website. <a href="credits.html">About</a></div>' +
    '<div class="announce" role="status"><span class="dot' + (st.open ? "" : " closed") + '" aria-hidden="true"></span><strong>' + st.label + '</strong><span class="long"> · Tearoom is walk-in, no booking needed</span> · <a href="visit.html">Plan your visit</a></div>' +
    '<header class="site-header"><div class="wrap header-inner">' +
      '<a class="wordmark" href="index.html" aria-label="Pooh Corner, Hartfield — home"><span>Pooh Corner</span><span>Hartfield · Est. 1978</span></a>' +
      '<nav class="nav-main" aria-label="Main"><ul>' + navLinks() + "</ul></nav>" +
      '<div class="header-actions">' +
        '<a class="icon-btn" href="shop.html#search" aria-label="Search the shop">' + I.search + "</a>" +
        '<button class="icon-btn js-basket" type="button" aria-label="Basket">' + I.bag + '<span class="basket-count" hidden>0</span></button>' +
        '<button class="icon-btn menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">' + I.menu + "</button>" +
        '<a class="btn btn--primary header-cta" href="visit.html">Plan your visit</a>' +
      "</div>" +
    "</div></header>" +
    '<div class="mobile-nav" id="mobile-nav" aria-label="Menu" role="dialog" aria-modal="true">' +
      '<div class="mobile-nav-top"><a class="wordmark" href="index.html"><span>Pooh Corner</span><span>Hartfield · Est. 1978</span></a>' +
      '<button class="icon-btn js-close-menu" type="button" aria-label="Close menu">' + I.close + "</button></div>" +
      '<ul><li><a href="index.html">Home</a></li>' + navLinks() + '<li><a href="visit.html#faqs">FAQs</a></li></ul>' +
      '<div class="mobile-meta"><p><span class="status-pill' + (st.open ? "" : " closed") + '">' + st.label + "</span></p>" +
      "<p>" + INFO.address + '<br><a href="tel:' + INFO.phoneVisit.replace(/\s/g, "") + '">' + INFO.phoneVisit + "</a></p>" +
      '<a class="btn btn--primary btn--block" href="visit.html">Plan your visit</a></div>' +
    "</div>";

  var footerHTML =
    '<footer class="site-footer"><div class="wrap"><div class="footer-grid">' +
      '<div><a class="wordmark" href="index.html"><span>Pooh Corner</span><span>Hartfield · Est. 1978</span></a>' +
        '<p style="margin-top:24px;max-width:34ch">Tearoom, museum and gift shop on the edge of Ashdown Forest.</p>' +
        "<p>" + INFO.address + "</p></div>" +
      "<div><h4>Visit</h4><ul>" +
        '<li><a href="visit.html#hours">Opening hours</a></li><li><a href="visit.html#getting-here">Getting here</a></li>' +
        '<li><a href="visit.html#tearoom">Tearoom &amp; afternoon tea</a></li><li><a href="visit.html#accessibility">Accessibility</a></li><li><a href="visit.html#faqs">FAQs</a></li></ul></div>' +
      "<div><h4>Shop</h4><ul>" +
        '<li><a href="shop.html">Shop all gifts</a></li><li><a href="shop.html?cat=centenary">100th anniversary</a></li>' +
        '<li><a href="shop.html?cat=gift-cards">Gift cards</a></li><li><a href="shop.html#delivery">Delivery &amp; returns</a></li></ul></div>' +
      "<div><h4>Contact</h4><ul>" +
        '<li>Visits &amp; tearoom<br><a href="tel:' + INFO.phoneVisit.replace(/\s/g, "") + '">' + INFO.phoneVisit + '</a><br><a href="mailto:' + INFO.emailVisit + '">' + INFO.emailVisit + "</a></li>" +
        '<li>Online orders<br><a href="tel:' + INFO.phoneShop.replace(/\s/g, "") + '">' + INFO.phoneShop + '</a><br><a href="mailto:' + INFO.emailShop + '">' + INFO.emailShop + "</a></li>" +
        '<li><a href="' + INFO.instagram + '" rel="noopener">Instagram</a></li></ul></div>' +
    "</div>" +
    '<div class="footer-base"><span>Independent redesign concept for discussion. Not affiliated with or endorsed by Pooh Corner. Business details taken from the current public websites and still to be confirmed.</span>' +
    '<span><a href="credits.html">Photo credits &amp; notes</a></span></div>' +
    "</div></footer>" +
    '<aside class="drawer" id="basket" aria-label="Basket" aria-hidden="true"><div class="drawer-head"><h2>Your basket</h2>' +
      '<button class="icon-btn js-close-basket" type="button" aria-label="Close basket">' + I.close + "</button></div>" +
      '<div class="drawer-body"></div><div class="drawer-foot"></div></aside><div class="drawer-backdrop js-close-basket"></div>' +
    '<div class="toast" role="status" aria-live="polite"></div>';

  var headSlot = $("#site-header");
  if (headSlot) headSlot.outerHTML = headerHTML;
  var footSlot = $("#site-footer");
  if (footSlot) footSlot.outerHTML = footerHTML;

  // Mobile menu
  var mnav = $("#mobile-nav"), toggle = $(".menu-toggle");
  function setMenu(open) {
    if (!mnav) return;
    mnav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) $(".js-close-menu").focus(); else toggle.focus();
  }
  if (toggle) toggle.addEventListener("click", function () { setMenu(true); });
  $all(".js-close-menu").forEach(function (b) { b.addEventListener("click", function () { setMenu(false); }); });
  $all("#mobile-nav a").forEach(function (a) { a.addEventListener("click", function () { mnav.classList.remove("open"); document.body.style.overflow = ""; }); });

  // ---------- Toast ----------
  var toastTimer;
  function toast(msg, sub) {
    var t = $(".toast"); if (!t) return;
    t.innerHTML = esc(msg) + (sub ? "<small>" + esc(sub) + "</small>" : "");
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 3800);
  }
  window.toast = toast;

  // ---------- Simulated basket ----------
  var basket = store("pc-basket") || [];
  function productBy(handle) { return (window.PRODUCTS || []).filter(function (p) { return p.handle === handle; })[0]; }
  function basketTotal() { return basket.reduce(function (s, l) { var p = productBy(l.h); return s + (p ? p.price * l.q : 0); }, 0); }
  function renderBasket() {
    var n = basket.reduce(function (s, l) { return s + l.q; }, 0);
    $all(".basket-count").forEach(function (c) { c.textContent = n; c.hidden = n === 0; });
    var body = $("#basket .drawer-body"), foot = $("#basket .drawer-foot");
    if (!body) return;
    if (!basket.length) {
      body.innerHTML = '<p>Your basket is empty.</p><p><a class="link-arrow" href="shop.html">Browse gifts</a></p>';
      foot.innerHTML = "";
      return;
    }
    body.innerHTML = basket.map(function (l) {
      var p = productBy(l.h); if (!p) return "";
      return '<div class="line-item"><img src="' + img(p.images[0], 160) + '" alt="" loading="lazy"><div><a href="product.html?p=' + p.handle + '">' + esc(p.title) + "</a><br><span class=\"small\">Qty " + l.q + '</span> <button type="button" data-remove="' + p.handle + '">Remove</button></div><span class="price">' + money(p.price * l.q) + "</span></div>";
    }).join("");
    var total = basketTotal(), left = INFO.freeShipping - total;
    foot.innerHTML =
      '<p style="display:flex;justify-content:space-between;font-weight:600;margin-bottom:8px"><span>Subtotal</span><span>' + money(total) + "</span></p>" +
      '<p class="small muted">' + (left > 0 ? "Spend " + money(left) + " more for free UK delivery." : "You qualify for free UK delivery.") + "</p>" +
      '<button class="btn btn--primary btn--block js-checkout" type="button">Checkout securely</button>' +
      '<p class="sim-note" style="margin-top:12px">' + I.info + "<span>Prototype: in the live build this hands over to the existing Shopify checkout.</span></p>";
    $all("[data-remove]", body).forEach(function (b) {
      b.addEventListener("click", function () { basket = basket.filter(function (l) { return l.h !== b.getAttribute("data-remove"); }); store("pc-basket", basket); renderBasket(); });
    });
    var co = $(".js-checkout", foot);
    if (co) co.addEventListener("click", function () { toast("Checkout is simulated in this concept", "The live site would use Pooh Corner's existing Shopify checkout."); });
  }
  function addToBasket(handle, qty) {
    qty = qty || 1;
    var line = basket.filter(function (l) { return l.h === handle; })[0];
    if (line) line.q += qty; else basket.push({ h: handle, q: qty });
    store("pc-basket", basket);
    renderBasket();
    var p = productBy(handle);
    toast("Added to basket: " + (p ? p.title : ""), "Prototype only — no real order is placed.");
  }
  window.addToBasket = addToBasket;
  var drawer = $("#basket"), backdrop = $(".drawer-backdrop");
  function setBasket(open) {
    if (!drawer) return;
    drawer.classList.toggle("open", open); backdrop.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  window.openBasket = function () { setBasket(true); };
  $all(".js-basket").forEach(function (b) { b.addEventListener("click", function () { setBasket(true); }); });
  $all(".js-close-basket").forEach(function (b) { b.addEventListener("click", function () { setBasket(false); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (drawer && drawer.classList.contains("open")) setBasket(false);
    if (mnav && mnav.classList.contains("open")) setMenu(false);
  });
  renderBasket();

  // ---------- Product card ----------
  var CAT_LABELS = {
    centenary: "100th anniversary", "soft-toys": "Soft toys", books: "Books", baby: "Baby", collectables: "Collectables",
    "pooh-corner": "From Pooh Corner", home: "Mugs & home", "gift-cards": "Gift cards"
  };
  window.CAT_LABELS = CAT_LABELS;
  function card(p) {
    var tag = p.compareAt ? '<span class="tag tag--sale">Sale</span>' : (p.category === "pooh-corner" ? '<span class="tag">From Pooh Corner</span>' : (p.centenary ? '<span class="tag">100 years</span>' : ""));
    return '<article class="product-card">' +
      '<div class="img">' + tag + '<img src="' + img(p.images[0], 600) + '" alt="' + esc(p.title) + '" loading="lazy"></div>' +
      "<h3>" + esc(p.title) + "</h3>" +
      '<div class="price">' + money(p.price) + (p.compareAt ? "<s>" + money(p.compareAt) + "</s>" : "") + "</div>" +
      '<a class="cover" href="product.html?p=' + p.handle + '" aria-label="' + esc(p.title) + ", " + money(p.price) + '"></a>' +
      "</article>";
  }
  window.productCard = card;

  // ---------- Reveal on scroll ----------
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    $all(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    $all(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  // Fill any [data-products="handle,handle"] grids
  $all("[data-products]").forEach(function (el) {
    var hs = el.getAttribute("data-products").split(",");
    el.innerHTML = hs.map(function (h) { var p = productBy(h.trim()); return p ? card(p) : ""; }).join("");
  });
  // Fill any [data-status] slots with live opening status
  $all("[data-status]").forEach(function (el) {
    el.textContent = st.label;
    if (el.classList.contains("status-pill")) el.classList.toggle("closed", !st.open);
  });
})();
