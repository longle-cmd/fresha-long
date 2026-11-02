/* Gemeinsames Skript für / (Vietnamesisch) und /de/ (Deutsch) */
/* ============ HIER ANPASSEN ============ */
var CONFIG = {
  bookingUrl: "https://meetings.hubspot.com/le-long?uuid=818438af-adc6-4ccb-84fc-bb6d62b44fd2",
  whatsapp:   "4915256215736",   // Nummer ohne +
  messengerUrl: "https://m.me/61595616761619",   // Facebook-Seite „Long Le - Fresha Cho Tiệm Nail DACH“ (nur VI-Seite)
  hintEvery:  30000,   // Termin-Hinweis alle 30 Sekunden wiederholen (in Millisekunden)
  videoUrl:   "",   // optional: YouTube-Embed, z. B. "https://www.youtube.com/embed/VIDEO_ID"
  /* Echte Kundenstimmen (mit schriftlichem Einverständnis!) eintragen und showTestimonials auf true setzen.
     Keine erfundenen Zitate veröffentlichen. */
  showTestimonials: false,
  text: {
    vi: {
      hint: "Đặt lịch tại đây",
      perYear: "mỗi năm",
      contact: "Chào Long, tiệm mình muốn được tư vấn về Fresha.",
      result: function (n, s) { return "Chào Long, tiệm mình có khoảng " + n + " khách bỏ hẹn mỗi tuần, mất khoảng " + s + " mỗi năm. Mình muốn được tư vấn."; },
      commission: function (n, r, s) { return "Chào Long, tiệm mình có khoảng " + n + " khách mới mỗi tháng, hoa hồng " + r + "%, mất khoảng " + s + " mỗi năm. Mình muốn được tư vấn."; },
      testimonials: [{text: "[Echtes Zitat auf Vietnamesisch]", who: "[Name], [Studio], [Stadt]"}]
    },
    de: {
      hint: "Hier Termin buchen",
      perYear: "pro Jahr",
      contact: "Hallo Long, ich interessiere mich für eine Beratung zu Fresha.",
      result: function (n, s) { return "Hallo Long, bei uns fallen etwa " + n + " Termine pro Woche aus, das sind rund " + s + " im Jahr. Ich hätte gern eine Beratung."; },
      commission: function (n, r, s) { return "Hallo Long, wir haben etwa " + n + " Neukunden im Monat und zahlen " + r + " % Provision, das sind rund " + s + " im Jahr. Ich hätte gern eine Beratung."; },
      testimonials: [{text: "[Echtes Zitat auf Deutsch]", who: "[Name], [Salon], [Stadt]"}]
    }
  }
};
/* ======================================= */
(function () {
  var T = CONFIG.text[document.documentElement.lang] || CONFIG.text.vi;
  function all(s) { return document.querySelectorAll(s); }
  function el(id) { return document.getElementById(id); }
  // Herkunft mitgeben: ?src=26-45-MO landet in der Nachricht und im Terminlink
  var query = new URLSearchParams(location.search);
  var src = (query.get("src") || "").replace(/[^\w-]/g, "").slice(0, 30);
  function tag(text) { return encodeURIComponent(text + (src ? " (" + src + ")" : "")); }
  function waUrl(text) { return "https://wa.me/" + CONFIG.whatsapp + "?text=" + tag(text); }
  function msUrl(text) { return CONFIG.messengerUrl + "?text=" + tag(text); }
  var book = CONFIG.bookingUrl + (src ? "&utm_source=longfresha&utm_campaign=" + encodeURIComponent(src) : "");
  all("[data-book]").forEach(function (a) { a.href = book; });
  all("[data-wa]").forEach(function (a) { a.href = waUrl(T.contact); });
  all("[data-ms]").forEach(function (a) { a.href = msUrl(T.contact); });
  // Sprachwechsel: Auswahl merken (nur im Browser) und src mitnehmen
  all("[data-lang]").forEach(function (a) {
    ["src", "calc"].forEach(function (k) {
      if (query.get(k)) a.href += (a.href.indexOf("?") < 0 ? "?" : "&") + k + "=" + encodeURIComponent(query.get(k));
    });
    a.addEventListener("click", function () {
      try { localStorage.setItem("lang", a.getAttribute("data-lang")); } catch (e) {}
    });
  });
  // No-Show-Rechner
  var n = el("cN"), p = el("cP");
  function calc() {
    var s = (+n.value * +p.value * 52).toLocaleString("de-DE") + " €", msg = T.result(n.value, s);
    el("oN").textContent = n.value;
    el("oP").textContent = p.value + " €";
    p.setAttribute("aria-valuetext", p.value + " €");
    el("cR").textContent = s;
    el("cW").href = waUrl(msg);
    if (el("cM")) el("cM").href = msUrl(msg);
  }
  n.addEventListener("input", calc); p.addEventListener("input", calc); calc();
  // Provisionsrechner
  var pn = el("pN"), pb = el("pB"), pr = el("pR");
  function commission() {
    var s = Math.round(+pn.value * +pb.value * +pr.value / 100 * 12).toLocaleString("de-DE") + " €", msg = T.commission(pn.value, pr.value, s);
    el("poN").textContent = pn.value;
    el("poB").textContent = pb.value + " €";
    el("poR").textContent = pr.value + " %";
    pb.setAttribute("aria-valuetext", pb.value + " €");
    pr.setAttribute("aria-valuetext", pr.value + " %");
    el("pV").textContent = s;
    el("pW").href = waUrl(msg);
    if (el("pM")) el("pM").href = msUrl(msg);
  }
  [pn, pb, pr].forEach(function (i) { i.addEventListener("input", commission); }); commission();
  // Screenreader: Ergebnis erst nach dem Loslassen ansagen, nicht bei jedem Zwischenwert
  var say = document.createElement("p");
  say.className = "sr";
  say.setAttribute("aria-live", "polite");
  document.querySelector(".hc").appendChild(say);
  [[pn, "pV"], [pb, "pV"], [pr, "pV"], [n, "cR"], [p, "cR"]].forEach(function (x) {
    x[0].addEventListener("change", function () { say.textContent = el(x[1]).textContent + " " + T.perYear; });
  });
  // Rechner-Tabs: Provision zuerst, ?calc=noshow oeffnet direkt die No-Shows
  var tabs = all("[role=tab]");
  function show(name, focus) {
    tabs.forEach(function (t) {
      var on = t.getAttribute("data-tab") === name;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      el("panel-" + t.getAttribute("data-tab")).classList.toggle("off", !on);
      if (on && focus) t.focus();
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { show(t.getAttribute("data-tab")); });
    t.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      show(tabs[(i + 1) % tabs.length].getAttribute("data-tab"), true);
    });
  });
  all("[data-calc]").forEach(function (a) {
    a.addEventListener("click", function () { show(a.getAttribute("data-calc")); });
  });
  if (query.get("calc") === "noshow") show("ns");
  // Kontaktleiste ausblenden, solange gleiche Buttons oder das Impressum im Bild sind
  if (document.documentElement.className === "choose") document.querySelector(".gate").focus();
  var floats = all(".bar,.fab");
  if (!("IntersectionObserver" in window)) floats.forEach(function (f) { f.classList.remove("off"); });
  else {
    var seen = new Set();
    var watch = new IntersectionObserver(function (es) {
      es.forEach(function (e) { seen[e.isIntersecting ? "add" : "delete"](e.target); });
      floats.forEach(function (f) { f.classList.toggle("off", seen.size > 0); });
    });
    all(".hero .btns,.cta .btns,.legal").forEach(function (t) { watch.observe(t); });
  }
  // Terminzähler: nur echte Werte von fresha.com, bei Fehlern verschwindet er. Nichts wird simuliert.
  function readCount(html) {
    var doc = new DOMParser().parseFromString(html, "text/html"), label = null;
    doc.querySelectorAll("span").forEach(function (x) { if (!label && /heute gebuchte Termine/.test(x.textContent) && !x.children.length) label = x; });
    if (!label || !label.previousElementSibling) return 0;
    var digits = "";
    label.previousElementSibling.querySelectorAll(".c_transparent").forEach(function (d) { digits += d.textContent; });
    var v = parseInt(digits.replace(/\D/g, ""), 10);
    return v > 1000 && v < 50000000 ? v : 0;
  }
  // Liest nur bis zur Fundstelle, statt die ganze Seite zu laden
  function readHead(r) {
    if (!r.body || !r.body.getReader) return r.text();
    var reader = r.body.getReader(), dec = new TextDecoder(), buf = "";
    return reader.read().then(function step(x) {
      if (x.done) return buf;
      buf += dec.decode(x.value, { stream: true });
      var i = buf.indexOf("gebuchte Termine");
      if (i < 0) return reader.read().then(step);
      reader.cancel();
      return buf.slice(0, i + 16);
    });
  }
  var liveTimer, liveNow = 0, liveRuns = 0, calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function liveShow(v) { el("liveN").textContent = Math.round(v).toLocaleString("de-DE"); }
  function liveSet(v) {
    var from = liveNow, start = 0;
    liveNow = v;
    if (!from || v <= from || calm) return liveShow(v);
    requestAnimationFrame(function step(t) {
      if (liveNow !== v) return;
      start = start || t;
      var p = Math.min((t - start) / 600, 1);
      liveShow(from + (v - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    });
  }
  // Fehler beim ersten Abruf blendet den Zähler aus, später bleibt der letzte echte Wert stehen
  function liveFail() { if (!liveNow) { el("live").classList.add("off"); clearInterval(liveTimer); } }
  function liveLoad() {
    if (document.hidden) return;
    if (++liveRuns > 8) return clearInterval(liveTimer);
    var ctrl = new AbortController(), stop = setTimeout(function () { ctrl.abort(); }, 6000);
    fetch("https://www.fresha.com/de", { credentials: "omit", cache: "no-cache", signal: ctrl.signal })
      .then(function (r) { if (!r.ok) throw 0; return readHead(r); })
      .then(function (t) {
        clearTimeout(stop);
        var v = readCount(t);
        if (!v) return liveFail();
        liveSet(v);
        el("live").classList.add("on");
      }).catch(function () { clearTimeout(stop); liveFail(); });
  }
  var net = navigator.connection || {};
  if (document.documentElement.className !== "choose" && window.fetch && window.DOMParser && window.AbortController && !net.saveData) {
    liveLoad();
    liveTimer = setInterval(liveLoad, innerWidth <= 800 ? 300000 : 120000);
  } else el("live").classList.add("off");
  // Termin-Hinweis: beim Ankommen, nach dem ersten Rechnen und danach regelmäßig. Pausiert beim Ziehen am Regler, endet nach dem Klick auf den Termin.
  var hintTimer, hintOff = false, dragging = false, calced = false;
  function showHint() {
    if (hintOff || dragging || document.hidden || document.documentElement.className === "choose") return;
    var target = [].filter.call(all("main [data-book],.fab [data-book],.bar [data-book]"), function (b) {
      var r = b.getBoundingClientRect();
      return r.width && r.top >= 44 && r.bottom <= innerHeight && getComputedStyle(b).visibility === "visible";
    })[0];
    if (!target) return;
    clearTimeout(hintTimer);
    all(".hint").forEach(function (h) { h.classList.remove("hint"); });
    target.setAttribute("data-hint", T.hint);
    target.classList.add("hint");
    hintTimer = setTimeout(function () { target.classList.remove("hint"); }, 5000);
  }
  setTimeout(showHint, 1200);
  setInterval(showHint, CONFIG.hintEvery);
  all("[data-book]").forEach(function (b) {
    b.addEventListener("click", function () { hintOff = true; });
  });
  [].forEach.call(all(".hc input"), function (i) {
    i.addEventListener("pointerdown", function () { dragging = true; });
    i.addEventListener("change", function () {
      dragging = false;
      if (!calced) setTimeout(showHint, 300);
      calced = true;
    });
  });
  addEventListener("pointerup", function () { dragging = false; });
  el("yr").textContent = new Date().getFullYear();
  if (CONFIG.videoUrl) { el("vid").src = CONFIG.videoUrl; el("vidwrap").hidden = false; }
  if (CONFIG.showTestimonials) {
    var box = el("tmlist");
    T.testimonials.forEach(function (t) {
      var d = document.createElement("div"); d.className = "quote";
      var q = document.createElement("p"); q.textContent = "“" + t.text + "”";
      var w = document.createElement("small"); w.textContent = t.who;
      d.appendChild(q); d.appendChild(w); box.appendChild(d);
    });
    el("tm").hidden = false;
  }
})();
