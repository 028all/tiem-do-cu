/* =========================================================================
   tiệm đồ cũ — app.js  (vanilla JS, không cần build)
   ========================================================================= */
(function () {
  "use strict";

  var CFG = window.SHOP_CONFIG || {};
  var PRODUCTS = (window.PRODUCTS || []).slice();

  /* ---------- danh mục & mốc giá ---------- */
  var CATS = [
    { key: "all",  label: "Tất cả" },
    { key: "ao",   label: "Quần áo" },
    { key: "giay", label: "Giày dép" },
    { key: "tui",  label: "Túi xách" },
  ];
  var CAT_LABEL = { ao: "Quần áo", giay: "Giày dép", tui: "Túi xách" };
  var PRICES = [
    { key: "all",     label: "Tất cả",  val: null },
    { key: "50000",   label: "50k",     val: 50000 },
    { key: "100000",  label: "100k",    val: 100000 },
    { key: "200000",  label: "200k",    val: 200000 },
    { key: "500000",  label: "500k",    val: 500000 },
    { key: "2000000", label: "2 triệu", val: 2000000 },
  ];

  var state = { category: "all", price: "all", query: "" };

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }
  function vnd(n) { return new Intl.NumberFormat("vi-VN").format(n) + "₫"; }

  // localStorage an toàn (tự về bộ nhớ tạm nếu trình duyệt chặn)
  var mem = {};
  var store = {
    get: function (k) { try { var v = localStorage.getItem(k); return v == null ? mem[k] : v; } catch (e) { return mem[k]; } },
    set: function (k, v) { mem[k] = v; try { localStorage.setItem(k, v); } catch (e) {} },
  };

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // ảnh giữ chỗ nếu sản phẩm chưa có ảnh
  function placeholder(p) {
    var cat = (CAT_LABEL[p.category] || "").toUpperCase();
    var name = (p.name || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">' +
      '<rect width="600" height="800" fill="#efeeea"/>' +
      '<text x="30" y="56" font-family="IBM Plex Sans, sans-serif" font-size="20" letter-spacing="2" fill="#b6b3ad">' + cat + '</text>' +
      '<foreignObject x="50" y="330" width="500" height="200">' +
      '<div xmlns="http://www.w3.org/1999/xhtml" style="font-family:IBM Plex Sans,sans-serif;font-size:30px;color:#9a968f;text-align:center;line-height:1.3">' + name + '</div>' +
      '</foreignObject>' +
      '<text x="300" y="760" text-anchor="middle" font-family="IBM Plex Sans, sans-serif" font-size="18" fill="#c9c5be">ảnh sản phẩm</text>' +
      '</svg>';
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }
  function imgOf(p, i) {
    if (p.images && p.images[i]) return p.images[i];
    return placeholder(p);
  }

  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg; t.hidden = false;
    requestAnimationFrame(function () { t.classList.add("show"); });
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      t.classList.remove("show");
      setTimeout(function () { t.hidden = true; }, 250);
    }, 1800);
  }

  /* ---------- order: random 1 lần khi tải ---------- */
  var ORDERED = shuffle(PRODUCTS.slice());

  /* ---------- lọc ---------- */
  function filtered() {
    var q = state.query.trim().toLowerCase();
    return ORDERED.filter(function (p) {
      if (state.category !== "all" && p.category !== state.category) return false;
      if (state.price !== "all" && String(p.price) !== state.price) return false;
      if (q && (p.name || "").toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
  }

  /* ---------- render chips ---------- */
  function buildChips() {
    var quick = $("#quickChips");
    quick.innerHTML = "";
    CATS.forEach(function (c) {
      var b = el("button", "chip");
      b.textContent = c.label;
      b.dataset.cat = c.key;
      if (state.category === c.key) b.classList.add("active");
      b.addEventListener("click", function () { state.category = c.key; syncChips(); render(); });
      quick.appendChild(b);
    });

    var catBox = $("#catChips");
    catBox.innerHTML = "";
    CATS.forEach(function (c) {
      var b = el("button", "chip");
      b.textContent = c.label; b.dataset.cat = c.key;
      if (state.category === c.key) b.classList.add("active");
      b.addEventListener("click", function () { state.category = c.key; syncChips(); render(); });
      catBox.appendChild(b);
    });

    var priceBox = $("#priceChips");
    priceBox.innerHTML = "";
    PRICES.forEach(function (pr) {
      var b = el("button", "chip");
      b.textContent = pr.label; b.dataset.price = pr.key;
      if (state.price === pr.key) b.classList.add("active");
      b.addEventListener("click", function () { state.price = pr.key; syncChips(); render(); });
      priceBox.appendChild(b);
    });
  }
  function syncChips() {
    document.querySelectorAll("[data-cat]").forEach(function (b) {
      b.classList.toggle("active", b.dataset.cat === state.category);
    });
    document.querySelectorAll("[data-price]").forEach(function (b) {
      b.classList.toggle("active", b.dataset.price === state.price);
    });
  }

  /* ---------- render lưới ---------- */
  function render() {
    var list = filtered();
    var grid = $("#grid");
    grid.innerHTML = "";
    $("#empty").hidden = list.length !== 0;

    list.forEach(function (p) {
      var card = el("div", "card");

      var media = el("div", "card__media");
      var im1 = el("img"); im1.className = "main"; im1.src = imgOf(p, 0); im1.alt = p.name; im1.loading = "lazy";
      var im2 = el("img"); im2.className = "alt"; im2.src = imgOf(p, 1); im2.alt = ""; im2.loading = "lazy"; im2.setAttribute("aria-hidden", "true");
      var quick = el("button", "card__quick"); quick.textContent = "Xem nhanh";
      media.appendChild(im1); media.appendChild(im2); media.appendChild(quick);
      media.addEventListener("click", function () { openProduct(p); });

      var body = el("div", "card__body");
      var name = el("h3", "card__name"); name.textContent = p.name;
      var meta = el("div", "card__meta");
      var price = el("span", "card__price"); price.textContent = vnd(p.price);
      var cat = el("span", "card__cat"); cat.textContent = CAT_LABEL[p.category] || "";
      meta.appendChild(price); meta.appendChild(cat);
      body.appendChild(name); body.appendChild(meta);

      card.appendChild(media); card.appendChild(body);
      grid.appendChild(card);
    });

    var rc = $("#resultCount");
    rc.textContent = list.length + " món";
  }

  /* ---------- modal sản phẩm ---------- */
  function openProduct(p) {
    var media = $("#pmMedia");
    media.innerHTML = "";
    var im = el("img"); im.src = imgOf(p, 0); im.alt = p.name; media.appendChild(im);
    $("#pmCat").textContent = CAT_LABEL[p.category] || "";
    $("#pmName").textContent = p.name;
    $("#pmPrice").textContent = vnd(p.price);
    $("#pmNote").textContent = p.note || "Hàng đã qua sử dụng, mô tả đúng tình trạng.";
    $("#pmAddCart").onclick = function () { addToCart(p); toast("Đã thêm vào giỏ"); };
    $("#pmBuyNow").onclick = function () { addToCart(p); closeOverlay($("#productOverlay")); openCheckout(); };
    showOverlay($("#productOverlay"));
  }

  /* ---------- giỏ hàng ---------- */
  function getCart() { try { return JSON.parse(store.get("cart") || "[]"); } catch (e) { return []; } }
  function setCart(c) { store.set("cart", JSON.stringify(c)); updateCartCount(); }
  function addToCart(p) {
    var c = getCart();
    c.push({ id: p.id, name: p.name, price: p.price, category: p.category, img: imgOf(p, 0) });
    setCart(c);
  }
  function removeFromCart(idx) { var c = getCart(); c.splice(idx, 1); setCart(c); renderCart(); }
  function cartSubtotal() { return getCart().reduce(function (s, i) { return s + i.price; }, 0); }
  function shipping() { return getCart().length ? (CFG.shippingFee || 0) : 0; }
  function cartTotal() { return cartSubtotal() + shipping(); }

  function updateCartCount() {
    var n = getCart().length, b = $("#cartCount");
    b.textContent = n; b.classList.toggle("show", n > 0);
  }

  function renderCart() {
    var c = getCart(), box = $("#cartItems");
    box.innerHTML = "";
    if (!c.length) {
      var em = el("p", "cart-empty"); em.textContent = "Giỏ hàng đang trống.";
      box.appendChild(em);
      $("#cartFoot").style.display = "none";
      return;
    }
    $("#cartFoot").style.display = "";
    c.forEach(function (it, idx) {
      var row = el("div", "citem");
      var img = el("img", "citem__img"); img.src = it.img; img.alt = it.name;
      var mid = el("div", "citem__mid");
      var nm = el("p", "citem__name"); nm.textContent = it.name;
      var pr = el("p", "citem__price"); pr.textContent = vnd(it.price);
      var rm = el("button", "citem__rm"); rm.textContent = "Xoá";
      rm.addEventListener("click", function () { removeFromCart(idx); });
      mid.appendChild(nm); mid.appendChild(pr); mid.appendChild(rm);
      row.appendChild(img); row.appendChild(mid);
      box.appendChild(row);
    });
    $("#cartSubtotal").textContent = vnd(cartSubtotal());
    $("#cartShip").textContent = shipping() ? vnd(shipping()) : "—";
    $("#cartTotal").textContent = vnd(cartTotal());
  }

  /* ---------- thanh toán ---------- */
  var payMethod = "vietqr";

  function payMethods() {
    var arr = [{
      key: "vietqr",
      title: "Chuyển khoản / Quét QR",
      sub: "Mọi app ngân hàng & MoMo đều quét được · tự điền số tiền",
      badge: "Nhanh nhất",
    }];
    if (CFG.momo && CFG.momo.phone) {
      arr.push({ key: "momo", title: "Ví MoMo", sub: "Chuyển tới số MoMo của shop", badge: "" });
    }
    return arr;
  }

  function buildPayOptions() {
    var box = $("#payOptions"); box.innerHTML = "";
    var methods = payMethods();
    payMethod = methods[0].key;
    methods.forEach(function (m) {
      var o = el("div", "pay-opt" + (m.key === payMethod ? " active" : ""));
      o.dataset.key = m.key;
      var radio = el("div", "pay-opt__radio");
      var main = el("div", "pay-opt__main");
      var t = el("div", "pay-opt__title"); t.textContent = m.title;
      var s = el("div", "pay-opt__sub"); s.textContent = m.sub;
      main.appendChild(t); main.appendChild(s);
      o.appendChild(radio); o.appendChild(main);
      if (m.badge) { var bd = el("span", "pay-opt__badge"); bd.textContent = m.badge; o.appendChild(bd); }
      o.addEventListener("click", function () {
        payMethod = m.key;
        document.querySelectorAll(".pay-opt").forEach(function (x) { x.classList.toggle("active", x.dataset.key === payMethod); });
      });
      box.appendChild(o);
    });
  }

  function openCheckout() {
    if (!getCart().length) { toast("Giỏ hàng đang trống"); return; }
    closeOverlay($("#cartOverlay"));
    $("#stepInfo").hidden = false;
    $("#stepPay").hidden = true;
    $("#stepDone").hidden = true;
    $("#infoError").hidden = true;
    buildPayOptions();
    $("#coSubtotal").textContent = vnd(cartSubtotal());
    $("#coShip").textContent = shipping() ? vnd(shipping()) : "—";
    $("#coTotal").textContent = vnd(cartTotal());
    showOverlay($("#checkoutOverlay"));
  }

  function genOrderCode() { return "DH" + Date.now().toString(36).slice(-5).toUpperCase(); }

  function buildVietQR(amount, info) {
    var b = CFG.bank || {};
    var base = "https://img.vietqr.io/image/" +
      encodeURIComponent(b.bankCode) + "-" +
      encodeURIComponent(b.accountNumber) + "-compact2.png";
    return base + "?amount=" + amount +
      "&addInfo=" + encodeURIComponent(info) +
      "&accountName=" + encodeURIComponent(b.accountName || "");
  }

  function goToPay() {
    var name = $("#coName").value.trim();
    var phone = $("#coPhone").value.trim();
    if (!name || !phone) { $("#infoError").hidden = false; return; }
    $("#infoError").hidden = true;

    var code = genOrderCode();
    goToPay._code = code;
    var amount = cartTotal();
    var detail = $("#payDetail");
    detail.innerHTML = "";

    function dl(k, v) {
      var r = el("div", "dl");
      var a = el("span"); a.textContent = k;
      var c = el("span"); c.textContent = v;
      r.appendChild(a); r.appendChild(c); detail.appendChild(r);
    }

    if (payMethod === "momo") {
      $("#payTitle").textContent = "Chuyển khoản qua MoMo";
      $("#paySub").textContent = "Mở MoMo → Chuyển tiền → nhập đúng nội dung bên dưới";
      $("#qrImg").src = buildVietQR(amount, code); // MoMo cũng quét được mã napas/VietQR
      dl("Số MoMo", CFG.momo.phone);
      dl("Tên", CFG.momo.name || "");
      dl("Số tiền", vnd(amount));
      dl("Nội dung", code);
    } else {
      $("#payTitle").textContent = "Quét mã để thanh toán";
      $("#paySub").textContent = "Mở app ngân hàng hoặc MoMo → quét mã VietQR";
      $("#qrImg").src = buildVietQR(amount, code);
      var b = CFG.bank || {};
      dl("Ngân hàng", b.bankCode);
      dl("Số tài khoản", b.accountNumber);
      dl("Chủ tài khoản", b.accountName);
      dl("Số tiền", vnd(amount));
      dl("Nội dung", code);
    }

    $("#stepInfo").hidden = true;
    $("#stepPay").hidden = false;
  }

  function confirmPaid() {
    var code = goToPay._code || genOrderCode();
    $("#orderCode").textContent = code;
    var parts = [];
    if (CFG.contact && CFG.contact.zalo) parts.push("nhắn Zalo " + CFG.contact.zalo);
    if (CFG.contact && CFG.contact.instagram) parts.push("hoặc IG @" + CFG.contact.instagram);
    $("#doneContact").textContent =
      "Vui lòng chụp màn hình mã đơn & gửi cho shop (" +
      (parts.join(" ") || "qua kênh liên hệ của shop") +
      ") để xác nhận và đóng gói nhé.";
    setCart([]); // dọn giỏ
    $("#stepPay").hidden = true;
    $("#stepDone").hidden = false;
  }

  /* ---------- overlay control ---------- */
  function showOverlay(o) { o.hidden = false; document.body.style.overflow = "hidden"; }
  function closeOverlay(o) { o.hidden = true; if (!anyOpen()) document.body.style.overflow = ""; }
  function anyOpen() {
    return ["#productOverlay", "#cartOverlay", "#checkoutOverlay"].some(function (s) { return !$(s).hidden; });
  }

  /* ---------- init ---------- */
  function init() {
    // brand
    if (CFG.name) { $("#brandName").textContent = CFG.name; $("#footName").textContent = CFG.name; document.title = CFG.name; }
    if (CFG.tagline) $("#brandTag").textContent = CFG.tagline;

    buildChips();
    render();
    updateCartCount();

    // search
    var sTimer;
    $("#search").addEventListener("input", function (e) {
      clearTimeout(sTimer);
      var v = e.target.value;
      sTimer = setTimeout(function () { state.query = v; render(); }, 120);
    });

    // filter panel toggle
    var ft = $("#filterToggle"), fp = $("#filterPanel");
    ft.addEventListener("click", function () {
      var open = fp.hidden;
      fp.hidden = !open;
      ft.setAttribute("aria-expanded", String(open));
    });
    $("#applyFilters").addEventListener("click", function () { fp.hidden = true; ft.setAttribute("aria-expanded", "false"); });
    $("#clearFilters").addEventListener("click", function () {
      state.category = "all"; state.price = "all"; state.query = ""; $("#search").value = "";
      syncChips(); render();
    });
    $("#emptyReset").addEventListener("click", function () {
      state.category = "all"; state.price = "all"; state.query = ""; $("#search").value = "";
      syncChips(); render();
    });

    // cart
    $("#cartBtn").addEventListener("click", function () { renderCart(); showOverlay($("#cartOverlay")); });
    $("#goCheckout").addEventListener("click", openCheckout);

    // checkout
    $("#toPay").addEventListener("click", goToPay);
    $("#backToInfo").addEventListener("click", function () { $("#stepPay").hidden = true; $("#stepInfo").hidden = false; });
    $("#paid").addEventListener("click", confirmPaid);
    $("#doneClose").addEventListener("click", function () { closeOverlay($("#checkoutOverlay")); });

    // đóng overlay: nút X + click nền + phím Esc
    document.querySelectorAll("[data-close]").forEach(function (b) {
      b.addEventListener("click", function () { closeOverlay(b.closest(".overlay")); });
    });
    document.querySelectorAll(".overlay").forEach(function (o) {
      o.addEventListener("click", function (e) { if (e.target === o) closeOverlay(o); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") document.querySelectorAll(".overlay").forEach(function (o) { if (!o.hidden) closeOverlay(o); });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
