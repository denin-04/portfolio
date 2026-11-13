/* =========================================================
   DENIN SAJI — PORTFOLIO // COMMAND CENTER
   Vanilla JS: particle network · boot · command palette ·
   text decode · tilt · spotlight · terminal · counters
========================================================= */
(function () {
  "use strict";
  var d = document, root = d.documentElement, body = d.body;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var base = body.dataset.base || "", pdir = body.dataset.pages || "";
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || "");
  var started = false;

  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }

  /* ---------- Mac key label ---------- */
  if (isMac) $$(".k-mod").forEach(function (k) { k.textContent = "⌘"; });

  /* ---------- Counters start at 0 (final value stays if JS is off) ---------- */
  if (!reduce) $$("[data-count]").forEach(function (el) {
    el.textContent = (0).toFixed(+el.dataset.decimals || 0) + (el.dataset.suffix || "");
  });

  /* ---------- Particle network canvas ---------- */
  (function network() {
    var cv = $("#bg-canvas"); if (!cv) return;
    var ctx = cv.getContext("2d"), w, h, dpr, pts = [], mouse = { x: -9999, y: -9999 };
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = innerWidth; h = innerHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      cv.style.width = w + "px"; cv.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(w < 700 ? 45 : 105, Math.floor(w * h / 15000));
      pts = [];
      for (var i = 0; i < n; i++) pts.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .38, vy: (Math.random() - .5) * .38,
        r: Math.random() * 1.4 + .5
      });
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      var i, j, p, q, dx, dy, dist;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        dx = mouse.x - p.x; dy = mouse.y - p.y; dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 170 && dist > 1) { p.vx += dx / dist * .012; p.vy += dy / dist * .012; }
        p.vx *= .995; p.vy *= .995;
        var sp = Math.abs(p.vx) + Math.abs(p.vy);
        if (sp < .12) { p.vx += (Math.random() - .5) * .02; p.vy += (Math.random() - .5) * .02; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fillStyle = "rgba(34,228,255,.75)"; ctx.fill();
        for (j = i + 1; j < pts.length; j++) {
          q = pts[j]; dx = p.x - q.x; dy = p.y - q.y; dist = dx * dx + dy * dy;
          if (dist < 14400) {
            ctx.strokeStyle = "rgba(139,92,255," + (.34 * (1 - dist / 14400)).toFixed(3) + ")";
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        dx = mouse.x - p.x; dy = mouse.y - p.y; dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          ctx.strokeStyle = "rgba(34,228,255," + (.55 * (1 - dist / 160)).toFixed(3) + ")";
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      if (!reduce) requestAnimationFrame(frame);
    }
    var rz; addEventListener("resize", function () { clearTimeout(rz); rz = setTimeout(function () { size(); if (reduce) frame(); }, 150); });
    addEventListener("mousemove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    d.addEventListener("mouseleave", function () { mouse.x = mouse.y = -9999; });
    size(); frame();
  })();

  /* ---------- Cursor glow + ring ---------- */
  if (fine && !reduce) {
    var glow = d.createElement("div"), ring = d.createElement("div");
    glow.className = "cursor-glow"; ring.className = "cursor-ring";
    body.appendChild(glow); body.appendChild(ring);
    var tx = innerWidth / 2, ty = innerHeight / 2, gx = tx, gy = ty, rx = tx, ry = ty;
    addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY; glow.style.opacity = 1; ring.style.opacity = 1;
      ring.classList.toggle("hot", !!(e.target.closest && e.target.closest("a,button,input,textarea,[data-tilt],.palette-list li")));
    }, { passive: true });
    (function loop() {
      gx += (tx - gx) * .08; gy += (ty - gy) * .08; rx += (tx - rx) * .28; ry += (ty - ry) * .28;
      glow.style.transform = "translate(" + gx + "px," + gy + "px)";
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Spotlight on .glow-card ---------- */
  d.addEventListener("mousemove", function (e) {
    var c = e.target.closest && e.target.closest(".glow-card");
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty("--mx", (e.clientX - r.left) + "px");
    c.style.setProperty("--my", (e.clientY - r.top) + "px");
  }, { passive: true });

  /* ---------- 3D tilt + magnetic buttons ---------- */
  if (fine && !reduce) {
    $$("[data-tilt]").forEach(function (el) {
      var max = parseFloat(el.dataset.tilt) || 6;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        el.style.transform = "perspective(900px) rotateX(" + (-py * max).toFixed(2) + "deg) rotateY(" + (px * max).toFixed(2) + "deg)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
    $$("[data-magnetic]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * .22).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * .3).toFixed(1) + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- Scroll: progress bar, nav state, timeline fill ---------- */
  var bar = $(".progress i"), nav = $(".navbar"), tl = $(".timeline");
  function onScroll() {
    var st = window.pageYOffset, max = root.scrollHeight - innerHeight;
    if (bar) bar.style.transform = "scaleX(" + (max > 0 ? st / max : 0) + ")";
    if (nav) nav.classList.toggle("scrolled", st > 10);
    if (tl) {
      var r = tl.getBoundingClientRect();
      var f = Math.min(1, Math.max(0, (innerHeight * .62 - r.top) / r.height));
      tl.style.setProperty("--fill", (f * 100).toFixed(1) + "%");
    }
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- Text decode ---------- */
  var GL = "01<>/\\{}[]#%&*+=?";
  function scramble(el) {
    if (reduce) return;
    var nodes = [], tw = d.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
    while ((n = tw.nextNode())) if (n.nodeValue.trim()) nodes.push([n, n.nodeValue]);
    var total = nodes.reduce(function (a, x) { return a + x[1].length; }, 0), frame = 0, frames = 34;
    (function tick() {
      frame++;
      var reveal = Math.floor(total * frame / frames), used = 0;
      nodes.forEach(function (x) {
        var t = x[1], out = "";
        for (var i = 0; i < t.length; i++) {
          var ch = t.charAt(i);
          out += (ch === " " || ch === "\n" || used + i < reveal) ? ch : GL.charAt(Math.floor(Math.random() * GL.length));
        }
        x[0].nodeValue = out; used += t.length;
      });
      if (frame < frames) requestAnimationFrame(tick);
      else nodes.forEach(function (x) { x[0].nodeValue = x[1]; });
    })();
  }

  /* ---------- Counters ---------- */
  function count(el) {
    var end = parseFloat(el.dataset.count), dec = +el.dataset.decimals || 0, suf = el.dataset.suffix || "";
    if (reduce) { el.textContent = end.toFixed(dec) + suf; return; }
    var t0 = performance.now(), dur = 1500;
    (function f(t) {
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (end * e).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(f);
    })(t0);
  }

  /* ---------- Terminal typing ---------- */
  function runTerm(el) {
    var lines = $$(".t-line", el);
    if (reduce) { lines.forEach(function (l) { l.classList.add("on"); }); return; }
    var i = 0;
    (function next() {
      if (i >= lines.length) return;
      var l = lines[i++]; l.classList.add("on");
      if (l.dataset.type === "cmd") {
        var span = $(".t-text", l), txt = span.textContent, k = 0; span.textContent = "";
        var iv = setInterval(function () {
          span.textContent = txt.slice(0, ++k);
          if (k >= txt.length) { clearInterval(iv); setTimeout(next, 280); }
        }, 32);
      } else setTimeout(next, 170);
    })();
  }

  /* ---------- Role rotator ---------- */
  function rotator() {
    var el = $("[data-words]"); if (!el || reduce) return;
    var words = el.dataset.words.split("|"), txt = $(".rot-text", el), wi = 0, ci = words[0].length, del = true;
    (function tick() {
      var w = words[wi]; ci += del ? -1 : 1; txt.textContent = w.slice(0, ci);
      var t = del ? 38 : 85;
      if (!del && ci === w.length) { del = true; t = 1700; }
      else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; t = 350; }
      setTimeout(tick, t);
    })();
  }

  /* ---------- Start (after boot) ---------- */
  function start() {
    if (started) return; started = true;
    var els = $$(".reveal,[data-scramble],[data-count],[data-terminal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); if (el.hasAttribute("data-count")) count(el); if (el.hasAttribute("data-terminal")) runTerm(el); });
    } else {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target; io.unobserve(el);
          if (el.classList.contains("reveal")) el.classList.add("in");
          if (el.hasAttribute("data-scramble")) scramble(el);
          if (el.hasAttribute("data-count")) count(el);
          if (el.hasAttribute("data-terminal")) runTerm(el);
        });
      }, { threshold: .15 });
      els.forEach(function (el) { io.observe(el); });
    }
    rotator();
  }

  /* ---------- Boot sequence (once per session) ---------- */
  (function boot() {
    var el = $("#boot");
    if (!el || !root.classList.contains("booting") || reduce) {
      root.classList.remove("booting"); if (el) el.remove(); start(); return;
    }
    var lines = $$(".boot-line", el), fill = $(".boot-bar i", el), pct = $(".boot-pct", el), i = 0, done = false;
    function finish() {
      if (done) return; done = true;
      try { sessionStorage.setItem("booted", "1"); } catch (e) {}
      el.classList.add("out");
      setTimeout(function () { root.classList.remove("booting"); el.remove(); start(); }, 560);
    }
    function step() {
      if (done) return;
      if (i < lines.length) {
        lines[i].classList.add("on"); i++;
        var p = Math.round(i / lines.length * 100);
        fill.style.width = p + "%"; pct.textContent = p + "%";
        setTimeout(step, 210);
      } else setTimeout(finish, 380);
    }
    el.addEventListener("click", finish);
    step();
  })();

  /* ---------- Mobile nav ---------- */
  var menuToggle = $("#menu-toggle");
  $$(".nav-links a").forEach(function (l) {
    l.addEventListener("click", function () { if (menuToggle) menuToggle.checked = false; });
  });

  /* ---------- Page transitions ---------- */
  function go(url) {
    body.classList.add("leaving");
    setTimeout(function () { location.href = url; }, reduce ? 0 : 260);
  }
  d.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]"); if (!a) return;
    var h = a.getAttribute("href");
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === "_blank" || /^(https?:|mailto:|tel:|#)/.test(h) || /\.pdf$/i.test(h)) return;
    e.preventDefault(); go(a.href);
  });
  addEventListener("pageshow", function (e) { if (e.persisted) body.classList.remove("leaving"); });

  /* ---------- Toast ---------- */
  var toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = d.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 2000);
  }

  /* ---------- Command palette ---------- */
  (function palette() {
    var cmds = [
      { l: "Home", h: base + "index.html", t: "Page", i: "→", k: "home start" },
      { l: "About", h: pdir + "about.html", t: "Page", i: "→", k: "about me objective" },
      { l: "Education", h: pdir + "education.html", t: "Page", i: "→", k: "education mca bca school" },
      { l: "Skills", h: pdir + "skills.html", t: "Page", i: "→", k: "skills stack python php laravel django" },
      { l: "Projects", h: pdir + "projects.html", t: "Page", i: "→", k: "projects work medreminder bookshop vegcart" },
      { l: "Certifications", h: pdir + "certifications.html", t: "Page", i: "→", k: "certifications courses" },
      { l: "Contact", h: pdir + "contact.html", t: "Page", i: "→", k: "contact message hire" },
      { l: "Download resume", h: base + "assets/documents/Denin_Resume.pdf", t: "File", i: "↓", k: "resume cv pdf", blank: true },
      { l: "Copy email address", copy: "deninsaji4@gmail.com", t: "Action", i: "⧉", k: "email copy mail" },
      { l: "Open GitHub", h: "https://github.com/denin-saji", t: "Link", i: "↗", k: "github code", blank: true },
      { l: "Open LinkedIn", h: "https://www.linkedin.com/in/denin-saji/", t: "Link", i: "↗", k: "linkedin network", blank: true }
    ];
    var box = d.createElement("div");
    box.className = "palette"; box.hidden = true;
    box.innerHTML = '<div class="palette-box" role="dialog" aria-modal="true" aria-label="Command menu">' +
      '<input class="palette-input" type="text" placeholder="Type a command or search…" aria-label="Search commands" autocomplete="off" spellcheck="false">' +
      '<ul class="palette-list" role="listbox"></ul>' +
      '<div class="palette-foot"><span>↑↓ navigate</span><span>↵ open</span><span>esc close</span></div></div>';
    body.appendChild(box);
    var input = $(".palette-input", box), list = $(".palette-list", box), shown = [], idx = 0, last = null;

    function render() {
      var q = input.value.trim().toLowerCase();
      shown = cmds.filter(function (c) { return !q || (c.l + " " + c.k + " " + c.t).toLowerCase().indexOf(q) > -1; });
      if (idx >= shown.length) idx = 0;
      list.innerHTML = shown.length ? shown.map(function (c, n) {
        return '<li role="option" data-n="' + n + '" class="' + (n === idx ? "active" : "") + '"><span class="pi">' + c.i + '</span><span>' + c.l + '</span><span class="ph">' + c.t + '</span></li>';
      }).join("") : '<li class="palette-empty">No matching command</li>';
    }
    function open() { last = d.activeElement; box.hidden = false; input.value = ""; idx = 0; render(); input.focus(); }
    function close() { box.hidden = true; if (last && last.focus) last.focus(); }
    function run(c) {
      if (!c) return;
      close();
      if (c.copy) {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(c.copy).then(function () { toast("Email copied to clipboard"); }, function () { toast(c.copy); });
        else toast(c.copy);
      } else if (c.blank) window.open(c.h, "_blank", "noopener");
      else go(c.h);
    }
    function setActive() {
      $$("li", list).forEach(function (li, n) { li.classList.toggle("active", n === idx); });
      var a = $("li.active", list); if (a && a.scrollIntoView) a.scrollIntoView({ block: "nearest" });
    }
    input.addEventListener("input", function () { idx = 0; render(); });
    list.addEventListener("click", function (e) { var li = e.target.closest("li[data-n]"); if (li) run(shown[+li.dataset.n]); });
    list.addEventListener("mousemove", function (e) { var li = e.target.closest("li[data-n]"); if (li && +li.dataset.n !== idx) { idx = +li.dataset.n; setActive(); } });
    box.addEventListener("mousedown", function (e) { if (e.target === box) close(); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); if (shown.length) { idx = (idx + 1) % shown.length; setActive(); } }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (shown.length) { idx = (idx - 1 + shown.length) % shown.length; setActive(); } }
      else if (e.key === "Enter") { e.preventDefault(); run(shown[idx]); }
    });
    d.addEventListener("keydown", function (e) {
      var tag = (e.target.tagName || "").toLowerCase(), typing = tag === "input" || tag === "textarea";
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); box.hidden ? open() : close(); }
      else if (e.key === "Escape" && !box.hidden) close();
      else if (e.key === "/" && !typing && box.hidden) { e.preventDefault(); open(); }
    });
    var btn = $("#cmdBtn"); if (btn) btn.addEventListener("click", open);
  })();

  /* ---------- Footer clock + year ---------- */
  var clk = $("#clock");
  if (clk) {
    var fmt; try { fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }); } catch (e) {}
    var tick = function () { clk.textContent = fmt ? fmt.format(new Date()) : new Date().toLocaleTimeString(); };
    tick(); setInterval(tick, 1000);
  }
  var yr = $("#current-year"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Contact form -> mailto ---------- */
  var form = $("#contactForm");
  if (form) form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var name = $("#name").value.trim(), email = $("#email").value.trim(), subj = $("#subject").value.trim(), msg = $("#message").value.trim();
    var status = $("#form-status");
    if (!name || !email || !msg) { if (status) status.textContent = "! Please fill in all fields."; return; }
    var subject = encodeURIComponent(subj || "Portfolio contact from " + name);
    var mail = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + msg);
    if (status) status.textContent = "> Opening your email app…";
    window.location.href = "mailto:deninsaji4@gmail.com?subject=" + subject + "&body=" + mail;
  });
})();
