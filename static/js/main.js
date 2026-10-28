/* =========================================================
   Suvo Dev — Portfolio interactions
   One requestAnimationFrame loop drives smooth scroll (Lenis),
   the cursor, the marquee and every scroll-linked effect.
   ========================================================= */
(() => {
  "use strict";

  document.documentElement.classList.remove("no-js");

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const pad = (n, len = 2) => String(n).padStart(len, "0");
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktop = () => window.matchMedia("(min-width: 901px)").matches;

  /* ---------- shared state ---------- */
  const S = {
    lenis: null,
    y: window.scrollY,
    lastY: window.scrollY,
    velocity: 0,
    dirty: true,          // scroll-linked effects need recomputing
    frameHooks: [],       // run every animation frame
    scrollHooks: [],      // run when scroll position changed
  };
  const onFrame = (fn) => S.frameHooks.push(fn);
  const onScrollChange = (fn) => S.scrollHooks.push(fn);

  /* ---------- toast ---------- */
  const toastEl = $("#toast");
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3400);
  }

  /* ---------- smooth scroll ---------- */
  function initSmoothScroll() {
    if (!reducedMotion && typeof window.Lenis === "function") {
      S.lenis = new window.Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      S.lenis.stop(); // stays locked until the boot screen finishes
      S.lenis.on("scroll", () => { S.dirty = true; });
    }
    window.addEventListener("scroll", () => { S.dirty = true; }, { passive: true });
    window.addEventListener("resize", () => { S.dirty = true; });

    // in-page links glide instead of jumping
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      const target = id === "#" || id === "#home" ? 0 : $(id);
      if (target === null) return;
      e.preventDefault();
      scrollToTarget(target);
      if (id.length > 1) history.replaceState(null, "", id);
    });
  }
  function scrollToTarget(target) {
    if (S.lenis) {
      S.lenis.scrollTo(target, { offset: target === 0 ? 0 : -10, duration: 1.5 });
    } else if (target === 0) {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    } else {
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  }
  const lockScroll = (lock) => {
    if (S.lenis) lock ? S.lenis.stop() : S.lenis.start();
    document.body.style.overflow = lock ? "hidden" : "";
  };

  /* ---------- the one animation loop ---------- */
  function loop(time) {
    if (S.lenis) S.lenis.raf(time);
    S.y = window.scrollY;
    const v = S.lenis ? S.lenis.velocity : S.y - S.lastY;
    S.velocity = lerp(S.velocity, v, 0.2);
    if (S.y !== S.lastY) S.dirty = true;
    S.lastY = S.y;
    if (S.dirty) {
      S.dirty = false;
      for (const fn of S.scrollHooks) fn(S.y);
    }
    for (const fn of S.frameHooks) fn(time);
    requestAnimationFrame(loop);
  }

  /* ---------- boot sequence ---------- */
  function boot(onDone) {
    const bootEl = $("#boot");
    const lines = $$(".boot-lines li");
    const bar = $(".boot-bar span");
    const pctEl = $("#bootPct");
    const stateEl = $("#bootState");

    const reveal = () => {
      document.body.classList.remove("loading");
      document.body.classList.add("ready");
      if (S.lenis) S.lenis.start();
      onDone();
    };

    // ?noboot in the URL skips the intro (handy while editing)
    if (new URLSearchParams(location.search).has("noboot")) {
      bootEl.classList.add("done");
      reveal();
      return;
    }

    let seen = false;
    try { seen = sessionStorage.getItem("sd-booted") === "1"; } catch (_) { /* storage blocked */ }
    const total = seen || reducedMotion ? 600 : 2000;
    const start = performance.now();
    let finished = false;

    function finish() {
      if (finished) return;
      finished = true;
      pctEl.textContent = "100%";
      bar.style.width = "100%";
      lines.forEach((l) => l.classList.add("show"));
      stateEl.textContent = "System online";
      stateEl.classList.add("on");
      try { sessionStorage.setItem("sd-booted", "1"); } catch (_) { /* ignore */ }
      setTimeout(() => {
        bootEl.classList.add("done");
        setTimeout(reveal, 250); // let the curtain start lifting first
      }, 350);
    }
    function tick(now) {
      if (finished) return;
      const p = clamp((now - start) / total, 0, 1);
      const eased = 1 - Math.pow(1 - p, 2);
      const pct = Math.round(eased * 100);
      pctEl.textContent = pad(pct, 3) + "%";
      bar.style.width = pct + "%";
      lines.forEach((l, i) => { if (p > (i + 0.6) / (lines.length + 0.6)) l.classList.add("show"); });
      if (p < 1) requestAnimationFrame(tick); else finish();
    }
    requestAnimationFrame(tick);
    bootEl.addEventListener("click", finish); // click to skip
  }

  /* ---------- cursor + HUD ---------- */
  function initCursor() {
    const hudX = $("#hudX"), hudY = $("#hudY");
    window.addEventListener("mousemove", (e) => {
      hudX.textContent = pad(Math.round(e.clientX), 3);
      hudY.textContent = pad(Math.round(e.clientY), 3);
    }, { passive: true });

    const hudTime = $("#hudTime");
    const tickTime = () => {
      try {
        hudTime.textContent = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Dhaka" });
      } catch (_) { hudTime.textContent = "--:--"; }
    };
    tickTime();
    setInterval(tickTime, 30000);

    if (!finePointer) return;
    const ring = $(".cursor"), dot = $(".cursor-dot"), label = $(".cursor-label");
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener("mousemove", (e) => {
      if (!document.body.classList.contains("has-cursor")) {
        document.body.classList.add("has-cursor");
        rx = e.clientX; ry = e.clientY;
      }
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    }, { passive: true });
    document.addEventListener("mouseleave", () => document.body.classList.remove("has-cursor"));
    onFrame(() => {
      rx = lerp(rx, mx, 0.2);
      ry = lerp(ry, my, 0.2);
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    });
    document.addEventListener("mouseover", (e) => {
      const card = e.target.closest(".work-card");
      ring.classList.toggle("view", !!card);
      label.textContent = card ? "View" : "";
      ring.classList.toggle("hover", !card && !!e.target.closest("a, button, .holo, input, textarea, label"));
    });
  }

  /* ---------- header, progress, section index, floating button ---------- */
  function initScrollChrome() {
    const header = $(".site-header");
    const bar = $(".scroll-progress span");
    const sections = $$("main section[data-num]");
    const links = $$(".sec-index a");
    const hudNum = $("#hudNum"), hudName = $("#hudName");
    const wa = $(".wa-float");
    const contact = $("#contact");
    const bigText = $(".f-big span");
    let prevY = 0, current = null;

    onScrollChange((y) => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

      header.classList.toggle("scrolled", y > 30);
      const menuOpen = document.body.classList.contains("menu-open");
      if (!menuOpen && Math.abs(y - prevY) > 4) header.classList.toggle("hide", y > prevY && y > 700);
      prevY = y;

      const mid = innerHeight * 0.45;
      let active = sections[0];
      for (const s of sections) if (s.getBoundingClientRect().top <= mid) active = s;
      if (active !== current) {
        current = active;
        links.forEach((a) => a.classList.toggle("active", a.dataset.target === active.id));
        hudNum.textContent = active.dataset.num;
        hudName.textContent = active.dataset.name;
      }

      // floating WhatsApp: after the hero, but out of the way once the contact section has its own links
      wa.classList.toggle("show", y > innerHeight * 0.8 && contact.getBoundingClientRect().top > innerHeight * 0.6);

      // footer name fills in over the last stretch of the page
      const remain = max - y;
      const p = 1 - clamp(remain / (innerHeight * 0.7), 0, 1);
      bigText.style.setProperty("--fill", (p * 100).toFixed(1) + "%");
    });
  }

  /* ---------- menu overlay ---------- */
  function initMenu() {
    const btn = $("#menuBtn"), menu = $("#menu");
    const set = (open) => {
      document.body.classList.toggle("menu-open", open);
      btn.setAttribute("aria-expanded", open);
      menu.setAttribute("aria-hidden", !open);
      $(".mono", btn).textContent = open ? "Close" : "Menu";
      $(".site-header").classList.remove("hide");
      lockScroll(open);
    };
    btn.addEventListener("click", () => set(!document.body.classList.contains("menu-open")));
    $$("[data-close]", menu).forEach((a) => a.addEventListener("click", () => set(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) set(false);
    });
  }

  /* ---------- split headings into words ---------- */
  function splitWords(el) {
    let wi = 0;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const parts = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(" "); return; }
        const w = document.createElement("span");
        w.className = "w";
        const inner = document.createElement("span");
        inner.className = "wi";
        inner.style.setProperty("--wi", wi++);
        inner.textContent = part;
        w.append(inner);
        frag.append(w);
      });
      node.replaceWith(frag);
    });
  }

  /* ---------- reveal, stagger, counters ---------- */
  function initReveal() {
    $$(".split").forEach(splitWords);
    $$("[data-stagger]").forEach((group) => {
      $$(".reveal", group).forEach((el, i) => el.style.setProperty("--d", i % 6));
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    $$(".reveal, .split").forEach((el) => io.observe(el));

    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        countUp(en.target);
        cio.unobserve(en.target);
      });
    }, { threshold: 0.6 });
    // hero counters start with the intro instead (see boot callback)
    $$("[data-count]").filter((el) => !el.closest("#home")).forEach((el) => cio.observe(el));
  }
  function countUp(el) {
    const target = +el.dataset.count;
    const dur = 1800, start = performance.now();
    const width = String(target).length > 1 ? 2 : 1;
    (function step(now) {
      const p = clamp((now - start) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = pad(Math.round(target * eased), width);
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  /* ---------- typed roles + glitch ---------- */
  function initTyped() {
    const el = $(".typed");
    if (!el) return;
    let roles;
    try { roles = JSON.parse(el.dataset.roles); } catch (_) { return; }
    if (reducedMotion || roles.length < 2) return;
    let r = 0, i = roles[0].length, deleting = true;
    function step() {
      const word = roles[r];
      if (deleting) {
        i--;
        el.textContent = word.slice(0, i);
        if (i === 0) { deleting = false; r = (r + 1) % roles.length; }
        setTimeout(step, i === 0 ? 350 : 35);
      } else {
        i++;
        el.textContent = word.slice(0, i);
        if (i === word.length) { deleting = true; setTimeout(step, 2200); }
        else setTimeout(step, 70);
      }
    }
    setTimeout(step, 2600);
  }
  function initGlitch() {
    const g = $(".hero-name .glitch");
    if (!g || reducedMotion) return;
    setInterval(() => {
      g.classList.add("glitching");
      setTimeout(() => g.classList.remove("glitching"), 360);
    }, 6000);
  }

  /* ---------- holo portrait + hero parallax ---------- */
  function initHolo() {
    const holo = $("#holo");
    if (!holo) return;
    const state = $("#holoState");
    let locked = false;
    let tx = 0, ty = 0, cx = 0, cy = 0, hovering = false;

    holo.addEventListener("pointermove", (e) => {
      const r = holo.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      holo.style.setProperty("--mx", px * 100 + "%");
      holo.style.setProperty("--my", py * 100 + "%");
      holo.classList.add("active");
      hovering = true;
      tx = (px - 0.5) * 10; ty = (0.5 - py) * 10;
    });
    holo.addEventListener("pointerleave", () => { holo.classList.remove("active"); hovering = false; tx = ty = 0; });
    const toggle = () => {
      locked = !locked;
      holo.classList.toggle("locked", locked);
      holo.setAttribute("aria-pressed", locked);
      state.textContent = locked ? "Circuit view locked · Click to release" : "Move to reveal · Click to lock";
    };
    holo.addEventListener("click", toggle);
    holo.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });

    if (reducedMotion) return;
    // eased 3D tilt
    if (finePointer) {
      onFrame(() => {
        if (!hovering && Math.abs(cx) < 0.01 && Math.abs(cy) < 0.01) return;
        cx = lerp(cx, tx, 0.1); cy = lerp(cy, ty, 0.1);
        holo.style.transform = `perspective(900px) rotateY(${cx.toFixed(2)}deg) rotateX(${cy.toFixed(2)}deg)`;
      });
    }
    // scroll parallax for photo + background glows
    const g1 = $(".bg-glow.g1"), g2 = $(".bg-glow.g2");
    const photos = $$(".holo-photo");
    onScrollChange((y) => {
      if (y < innerHeight * 1.5) {
        const py = (y * 0.08).toFixed(1);
        photos.forEach((p) => { p.style.transform = `translateX(-50%) translateY(${py}px)`; });
      }
      g1.style.transform = `translate3d(0, ${(y * 0.15).toFixed(1)}px, 0)`;
      g2.style.transform = `translate3d(0, ${(-y * 0.1).toFixed(1)}px, 0)`;
    });
  }

  /* ---------- magnetic buttons + spotlight cards ---------- */
  function initHoverFx() {
    if (!finePointer || reducedMotion) return;
    $$(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
    $$(".service").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  }

  /* ---------- stack orbit ---------- */
  function initOrbit() {
    const section = $("#stack"), orbit = $("#orbit");
    if (!orbit) return;
    const mods = $$(".mod", orbit);
    const n = mods.length;
    const panel = $("#modPanel");
    const dots = $$(".mp-dots i", panel);
    const ui = { idx: $("#modIdx"), name: $("#modName"), role: $("#modRole"), group: $("#modGroup") };
    let active = -1, rot = 0, hovering = false, autoTimer;

    const setRadius = () => {
      const size = orbit.clientWidth;
      orbit.style.setProperty("--R", Math.max(90, size / 2 - mods[0].offsetWidth / 2 - 6) + "px");
    };

    function setActive(i) {
      i = ((i % n) + n) % n;
      if (i === active) return;
      // rotate the shortest way round so the active module lands on top
      const step = 360 / n;
      let delta = (i - (active < 0 ? 0 : active)) * step;
      delta = ((delta + 540) % 360) - 180;
      rot = active < 0 ? i * step : rot + delta;
      active = i;
      orbit.style.setProperty("--rot", rot);
      mods.forEach((m, k) => m.classList.toggle("active", k === i));
      dots.forEach((d, k) => { d.classList.toggle("on", k === i); d.classList.toggle("past", k < i); });
      const m = mods[i];
      ui.idx.textContent = `${pad(i + 1)} / ${pad(n)}`;
      ui.name.textContent = m.dataset.name;
      ui.role.textContent = m.dataset.role;
      ui.group.textContent = "● " + m.dataset.group;
      panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
    }

    mods.forEach((m) => {
      m.addEventListener("mouseenter", () => { hovering = true; setActive(+m.dataset.i); });
      m.addEventListener("mouseleave", () => { hovering = false; });
      m.addEventListener("click", () => { setActive(+m.dataset.i); restartAuto(); });
      m.addEventListener("focus", () => setActive(+m.dataset.i));
    });

    // desktop: scrolling through the tall section turns the orbit
    onScrollChange(() => {
      if (!isDesktop() || hovering) return;
      const r = section.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = clamp(-r.top / (r.height - innerHeight), 0, 0.9999);
      setActive(Math.floor(p * n));
    });
    // mobile: rotate on a timer
    function restartAuto() {
      clearInterval(autoTimer);
      if (isDesktop() || reducedMotion) return;
      autoTimer = setInterval(() => setActive(active + 1), 2600);
    }

    setRadius();
    setActive(0);
    restartAuto();
    window.addEventListener("resize", () => { setRadius(); restartAuto(); });
  }

  /* ---------- work: filters, show more, tilt, dossier ---------- */
  function initWork() {
    const cards = $$(".work-card");
    const filters = $$(".filter");
    const moreBtn = $("#moreBtn");
    const INITIAL = 6;
    let filter = "all", expanded = false;

    function apply(animate) {
      let shown = 0;
      cards.forEach((c) => {
        const match = filter === "all" || c.dataset.filter === filter;
        const visible = match && (expanded || filter !== "all" || shown < INITIAL);
        c.classList.toggle("is-hidden", !visible);
        if (visible) {
          if (animate) {
            c.classList.add("in");
            c.style.setProperty("--d", shown % 6);
            c.classList.remove("pop"); void c.offsetWidth; c.classList.add("pop");
          }
          shown++;
        }
      });
      const hiddenCount = cards.filter((c) => filter === "all" && c.classList.contains("is-hidden")).length;
      moreBtn.hidden = !(filter === "all" && !expanded && hiddenCount > 0);
      if (!moreBtn.hidden) $(".arr", moreBtn).previousSibling.textContent = `Show ${hiddenCount} more projects `;
      S.dirty = true;
      if (S.lenis) S.lenis.resize();
    }
    filters.forEach((f) => f.addEventListener("click", () => {
      filter = f.dataset.filter;
      filters.forEach((x) => { x.classList.toggle("active", x === f); x.setAttribute("aria-selected", x === f); });
      apply(true);
    }));
    moreBtn.addEventListener("click", () => { expanded = true; apply(true); });
    apply(false);

    if (finePointer && !reducedMotion) {
      cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `perspective(1100px) rotateY(${px * 5}deg) rotateX(${-py * 5}deg) translateY(-6px)`;
        });
        card.addEventListener("mouseleave", () => { card.style.transform = ""; });
      });
    }

    /* dossier modal */
    const modal = $("#dossier");
    const box = $(".modal-box", modal);
    const body = $(".modal-body", modal);
    const projects = window.PROJECTS || [];
    let current = -1, lastFocus = null;

    const visibleSlugs = () => cards.filter((c) => filter === "all" || c.dataset.filter === filter).map((c) => c.dataset.slug);
    const make = (tag, props) => Object.assign(document.createElement(tag), props);

    function render(idx) {
      const p = projects[idx];
      current = idx;
      box.style.setProperty("--c1", p.c1);
      box.style.setProperty("--c2", p.c2);
      $("#dIdx").textContent = `${pad(idx + 1)} / ${pad(projects.length)}`;
      const img = $("#dImg"), glyph = $("#dGlyph");
      if (p.image_path) {
        img.src = (document.querySelector(`.work-card[data-slug="${p.slug}"] .shot-view img`) || {}).src || "/static/" + p.image_path;
        img.alt = `${p.title} screenshot`;
        img.hidden = false; glyph.hidden = true;
      } else {
        img.hidden = true; img.removeAttribute("src"); glyph.hidden = false;
        const caps = p.title.match(/[A-Z]/g) || [];
        glyph.textContent = (caps.length >= 2 ? caps.slice(0, 2).join("") : p.title.slice(0, 2)).toUpperCase();
      }
      $("#dCat").textContent = `${p.category} · ${p.year}`;
      $("#dTitle").textContent = p.title;
      $("#dDesc").textContent = p.description;
      $("#dFeatures").replaceChildren(...p.features.map((f) => make("li", { textContent: f })));
      $("#dTags").replaceChildren(...p.tags.map((t) => make("li", { textContent: t })));
      const links = $("#dLinks");
      links.replaceChildren();
      if (p.live) links.append(make("a", { href: p.live, target: "_blank", rel: "noopener", className: "primary", textContent: "Visit live site ↗" }));
      if (p.source) links.append(make("a", { href: p.source, target: "_blank", rel: "noopener", textContent: "View source ↗" }));
      if (!p.live && !p.source) links.append(make("span", { textContent: "Client project · private" }));
      body.classList.remove("swap"); void body.offsetWidth; body.classList.add("swap");
      box.scrollTop = 0;
    }
    function open(slug) {
      const idx = projects.findIndex((p) => p.slug === slug);
      if (idx < 0) return;
      render(idx);
      lastFocus = document.activeElement;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      lockScroll(true);
      $(".modal-nav [data-close-modal]", modal).focus({ preventScroll: true });
    }
    function close() {
      if (!modal.classList.contains("open")) return;
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      lockScroll(false);
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    }
    function step(dir) {
      const list = visibleSlugs();
      const pos = list.indexOf(projects[current].slug);
      const next = list[(pos + dir + list.length) % list.length];
      render(projects.findIndex((p) => p.slug === next));
    }
    $$("[data-open]").forEach((b) => b.addEventListener("click", () => open(b.dataset.open)));
    $$("[data-close-modal]", modal).forEach((b) => b.addEventListener("click", close));
    $("#dPrev").addEventListener("click", () => step(-1));
    $("#dNext").addEventListener("click", () => step(1));
    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });
  }

  /* ---------- journey timeline ---------- */
  function initJourney() {
    const nodes = $$(".node"), cards = $$(".j-card");
    if (!nodes.length) return;
    const n = nodes.length;
    const fill = $("#trackFill"), count = $("#nodeCount");
    const prev = $("#prevNode"), next = $("#nextNode");
    let cur = 0;
    function go(i) {
      i = clamp(i, 0, n - 1);
      cards.forEach((c, k) => {
        c.classList.toggle("leave", k < i);
        c.classList.toggle("active", k === i);
      });
      nodes.forEach((nd, k) => {
        nd.classList.toggle("active", k === i);
        nd.classList.toggle("done", k < i);
      });
      fill.style.width = n > 1 ? (i / (n - 1)) * 100 + "%" : "0";
      count.textContent = `${pad(i + 1)} / ${pad(n)}`;
      prev.disabled = i === 0;
      next.disabled = i === n - 1;
      cur = i;
    }
    nodes.forEach((nd) => nd.addEventListener("click", () => go(+nd.dataset.i)));
    prev.addEventListener("click", () => go(cur - 1));
    next.addEventListener("click", () => go(cur + 1));
    const box = $("#journeyBox");
    box.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") go(cur + 1);
      if (e.key === "ArrowLeft") go(cur - 1);
    });
    // swipe on touch screens
    let sx = null;
    const cardsWrap = $(".j-cards", box);
    cardsWrap.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    cardsWrap.addEventListener("touchend", (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1));
      sx = null;
    });
    go(0);
  }

  /* ---------- marquee (speeds up with scroll velocity) ---------- */
  function initMarquee() {
    const rows = $$(".mq-row").map((row) => ({
      track: $(".mq-track", row),
      set: $(".mq-set", row),
      dir: +row.dataset.dir,
      x: 0,
      w: 0,
    }));
    if (!rows.length || reducedMotion) return;
    const measure = () => rows.forEach((r) => {
      r.w = r.set.offsetWidth;
      if (r.dir > 0 && r.x === 0) r.x = -r.w;
    });
    measure();
    window.addEventListener("resize", measure);

    let visible = false, last = performance.now();
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe($(".marquee"));
    onFrame((now) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      if (!visible) return;
      const boost = clamp(Math.abs(S.velocity) * 6, 0, 600);
      rows.forEach((r) => {
        r.x += r.dir * (45 + boost) * dt;
        if (r.x <= -r.w) r.x += r.w;
        if (r.x > 0) r.x -= r.w;
        r.track.style.transform = `translate3d(${r.x.toFixed(2)}px, 0, 0)`;
      });
    });
  }

  /* ---------- contact form ---------- */
  function initContact() {
    const form = $("#contactForm");
    if (!form) return;
    const status = $("#formStatus");
    // form.name is the form's own attribute, so look fields up explicitly
    const field = {
      name: form.elements.namedItem("name"),
      email: form.elements.namedItem("email"),
      message: form.elements.namedItem("message"),
    };
    const btn = $("button[type=submit]", form);
    const btnLabel = $(".btn-label", btn);
    const setStatus = (msg, cls = "") => { status.textContent = msg; status.className = "f-status mono " + cls; };
    const services = () => $$('input[name="services"]:checked', form).map((i) => i.value);
    const budget = () => ($('input[name="budget"]:checked', form) || {}).value || "";

    function validate() {
      const errs = {};
      const name = field.name.value.trim(), email = field.email.value.trim(), message = field.message.value.trim();
      if (name.length < 2) errs.name = "Please enter your name.";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.email = "Please enter a valid email.";
      if (message.length < 10) errs.message = "Tell me a little more (at least 10 characters).";
      Object.keys(field).forEach((k) => field[k].classList.toggle("invalid", !!errs[k]));
      return errs;
    }
    Object.values(field).forEach((f) => f.addEventListener("input", () => f.classList.remove("invalid")));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length) {
        setStatus("> " + Object.values(errs)[0], "err");
        field[Object.keys(errs)[0]].focus();
        return;
      }
      btn.disabled = true;
      btnLabel.textContent = "Sending…";
      setStatus("> Transmitting…");
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: field.name.value, email: field.email.value, message: field.message.value,
            services: services(), budget: budget(), website: form.elements.namedItem("website").value,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setStatus("> " + (data.errors ? Object.values(data.errors)[0] : "Something went wrong."), "err");
        } else {
          setStatus("> " + data.message, "ok");
          toast("✓ Brief received — talk soon!");
          form.reset();
        }
      } catch (_) {
        setStatus("> Network error. Try “Prepare email” instead.", "err");
      } finally {
        btn.disabled = false;
        btnLabel.textContent = "Send brief";
      }
    });

    $("#mailBtn").addEventListener("click", (e) => {
      const name = field.name.value.trim(), message = field.message.value.trim();
      const extra = [services().length ? "Services: " + services().join(", ") : "", budget() ? "Budget: " + budget() : ""].filter(Boolean).join("\n");
      const subject = encodeURIComponent(`Project inquiry${name ? " from " + name : ""}`);
      const bodyText = `${message || "Hi Suvo, I'd like to talk about a project."}\n\n${extra}\n\n— ${name}\n${field.email.value.trim()}`;
      window.location.href = `mailto:${e.currentTarget.dataset.email}?subject=${subject}&body=${encodeURIComponent(bodyText.trim())}`;
    });
  }

  /* ---------- start ---------- */
  initSmoothScroll();
  initCursor();
  initScrollChrome();
  initMenu();
  initHoverFx();
  initHolo();
  initOrbit();
  initWork();
  initJourney();
  initMarquee();
  initContact();
  requestAnimationFrame(loop);
  boot(() => {
    initReveal();
    initTyped();
    initGlitch();
    $$("[data-count]", $("#home")).forEach(countUp);
  });
})();
