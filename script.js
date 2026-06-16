// ===== Year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Navbar scroll state + progress bar =====
const nav = document.getElementById("nav");
const progress = document.getElementById("scrollProgress");

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 30);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ===== Mobile menu =====
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");
toggle.addEventListener("click", () => {
  toggle.classList.toggle("open");
  links.classList.toggle("open");
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    toggle.classList.remove("open");
    links.classList.remove("open");
  })
);

// ===== Typed roles =====
const roles = [
  "Software Engineer.",
  "Salesforce Developer.",
  "Full-Stack Developer.",
  "Cloud Engineer.",
  "Systems Programmer.",
];
const typedEl = document.getElementById("typed");
let roleIdx = 0,
  charIdx = 0,
  deleting = false;

function typeLoop() {
  const current = roles[roleIdx];
  if (deleting) {
    charIdx--;
  } else {
    charIdx++;
  }
  typedEl.textContent = current.slice(0, charIdx);

  let delay = deleting ? 45 : 90;
  if (!deleting && charIdx === current.length) {
    delay = 1700;
    deleting = true;
  } else if (deleting && charIdx === 0) {
    deleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    delay = 350;
  }
  setTimeout(typeLoop, delay);
}
typeLoop();

// ===== Reveal on scroll =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = Math.min(i * 0.04, 0.25) + "s";
  revealObserver.observe(el);
});

// ===== Animated stat counters =====
function formatNum(n) {
  return n.toLocaleString("en-US");
}
function animateCount(el) {
  const target = +el.dataset.count;
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const dur = 1600;
  const start = performance.now();
  function frame(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + formatNum(Math.floor(eased * target)) + suffix;
    if (p < 1) requestAnimationFrame(frame);
    else el.textContent = prefix + formatNum(target) + suffix;
  }
  requestAnimationFrame(frame);
}
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll(".stat__num").forEach((el) => statObserver.observe(el));

// ===== Hero spotlight follows cursor =====
const hero = document.querySelector(".hero");
const spotlight = document.getElementById("spotlight");
if (hero && spotlight) {
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    spotlight.style.setProperty("--mx", e.clientX - r.left + "px");
    spotlight.style.setProperty("--my", e.clientY - r.top + "px");
  });
}

// ===== Back to top =====
const toTop = document.getElementById("toTop");
window.addEventListener(
  "scroll",
  () => toTop.classList.toggle("show", window.scrollY > 600),
  { passive: true }
);
toTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

// ===== Subtle 3D tilt on project cards (pointer-capable, fine pointers only) =====
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (finePointer && !reducedMotion) {
  document.querySelectorAll(".proj").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

// ===== Hero particle field =====
(function particles() {
  const canvas = document.getElementById("particles");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  const heroEl = canvas.parentElement;
  let w, h, dots, dpr;
  const COLORS = ["110,231,255", "167,139,250", "240,171,252"];

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = heroEl.clientWidth;
    h = heroEl.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(70, Math.floor((w * h) / 16000));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      a: Math.random() * 0.5 + 0.2,
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0) d.x = w; else if (d.x > w) d.x = 0;
      if (d.y < 0) d.y = h; else if (d.y > h) d.y = 0;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${d.c},${d.a})`;
      ctx.fill();
      for (let j = i + 1; j < dots.length; j++) {
        const e = dots[j];
        const dx = d.x - e.x, dy = d.y - e.y;
        const dist = dx * dx + dy * dy;
        if (dist < 12000) {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(e.x, e.y);
          ctx.strokeStyle = `rgba(${d.c},${0.10 * (1 - dist / 12000)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  }

  size();
  frame();
  let t;
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(size, 200);
  });
})();

// ===== Magnetic buttons =====
if (finePointer && !reducedMotion) {
  document.querySelectorAll(".btn--primary").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const mx = e.clientX - r.left - r.width / 2;
      const my = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${mx * 0.25}px, ${my * 0.35}px)`;
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "";
    });
  });
}

// ===== Active nav link highlight =====
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav__links a");
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach((a) =>
          a.style.setProperty(
            "color",
            a.getAttribute("href") === "#" + id ? "var(--text)" : ""
          )
        );
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => navObserver.observe(s));

/* =====================================================================
   DYNAMIC BACKGROUND (mouse + scroll parallax + idle drift)
   ===================================================================== */
(function bgParallax() {
  const g1 = document.querySelector(".glow-1");
  const g2 = document.querySelector(".glow-2");
  if (!g1 || !g2) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  if (!reduce) {
    window.addEventListener("pointermove", (e) => {
      tmx = e.clientX / window.innerWidth - 0.5;
      tmy = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
  }
  function loop(t) {
    mx += (tmx - mx) * 0.05;
    my += (tmy - my) * 0.05;
    const sy = window.scrollY;
    const drift = reduce ? 0 : Math.sin(t / 3500);
    g1.style.transform = `translate(${(mx * 60 + drift * 25).toFixed(1)}px, ${(my * 60 + sy * 0.06).toFixed(1)}px)`;
    g2.style.transform = `translate(${(-mx * 80 - drift * 30).toFixed(1)}px, ${(-my * 70 + sy * 0.1).toFixed(1)}px)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* =====================================================================
   SKILL CHIP STAGGER
   ===================================================================== */
(function skillStagger() {
  const groups = document.querySelectorAll(".skill-group");
  if (!groups.length) return;
  groups.forEach((g) => {
    g.querySelectorAll(".chips span").forEach((s, i) => {
      s.style.transitionDelay = (i * 0.035).toFixed(3) + "s";
    });
  });
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
      });
    },
    { threshold: 0.2 }
  );
  groups.forEach((g) => obs.observe(g));
})();

/* =====================================================================
   TIMELINE PROGRESS FILL
   ===================================================================== */
(function timelineFill() {
  const tl = document.querySelector(".timeline");
  if (!tl) return;
  function update() {
    const r = tl.getBoundingClientRect();
    const mid = window.innerHeight * 0.55;
    let prog = (mid - r.top) / r.height;
    prog = Math.max(0, Math.min(1, prog));
    tl.style.setProperty("--tl", prog.toFixed(3));
  }
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();

/* =====================================================================
   THEME SWITCHER
   ===================================================================== */
const THEMES = [
  { id: "", name: "Aurora" },
  { id: "green", name: "Terminal Green" },
  { id: "blue", name: "Salesforce Blue" },
  { id: "synth", name: "Synthwave" },
];
const themeBtn = document.getElementById("themeBtn");
const themeNameEl = document.getElementById("themeName");

function applyTheme(id, save = true) {
  const theme = THEMES.find((t) => t.id === id) || THEMES[0];
  if (theme.id) document.documentElement.setAttribute("data-theme", theme.id);
  else document.documentElement.removeAttribute("data-theme");
  if (themeNameEl) themeNameEl.textContent = theme.name;
  if (save) localStorage.setItem("sc-theme", theme.id);
}
applyTheme(localStorage.getItem("sc-theme") || "", false);

function cycleTheme() {
  const current = localStorage.getItem("sc-theme") || "";
  const idx = THEMES.findIndex((t) => t.id === current);
  applyTheme(THEMES[(idx + 1) % THEMES.length].id);
}
if (themeBtn) themeBtn.addEventListener("click", cycleTheme);

/* =====================================================================
   INTERACTIVE TERMINAL
   ===================================================================== */
(function terminal() {
  const body = document.getElementById("termBody");
  const input = document.getElementById("termInput");
  const term = document.getElementById("term");
  if (!body || !input) return;

  const history = [];
  let hIdx = -1;
  const INTRO_LINE =
    '<div class="term__line"><span class="term__path">~</span> <span class="term__muted">type</span> <span class="term__cmd">help</span> <span class="term__muted">to get started, or try</span> <span class="term__cmd">projects</span></div>';

  function print(html, cls = "") {
    const div = document.createElement("div");
    div.className = "term__line" + (cls ? " " + cls : "");
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }
  function printBlock(lines) {
    lines.forEach((l) => print(l));
  }

  const COMMANDS = {
    help() {
      return [
        '<span class="term__head">Available commands</span>',
        '  <span class="term__cmd">about</span>       who I am',
        '  <span class="term__cmd">projects</span>    what I\'ve built',
        '  <span class="term__cmd">skills</span>      languages &amp; tools',
        '  <span class="term__cmd">experience</span>  where I\'ve worked',
        '  <span class="term__cmd">education</span>   my degree',
        '  <span class="term__cmd">resume</span>      open my résumé (PDF)',
        '  <span class="term__cmd">contact</span>     how to reach me',
        '  <span class="term__cmd">social</span>      github &amp; linkedin',
        '  <span class="term__cmd">theme</span>       change the color theme',
        '  <span class="term__cmd">goto</span> &lt;page&gt; scroll to a section',
        '  <span class="term__cmd">clear</span>       clear the screen',
        '<span class="term__muted">Tip: press \u2318K / Ctrl-K anywhere for the command palette.</span>',
      ];
    },
    about() {
      return [
        '<span class="term__head">Sai Chappidi</span> \u2014 Software Engineer',
        "CSE @ The Ohio State University (B.S., May 2027).",
        "I build across the stack, ranging from low-level systems to full-stack",
        "web, Salesforce and cloud development, and AI projects.",
      ];
    },
    projects() {
      return [
        '<span class="term__head">Projects</span>',
        '  <span class="term__key">BlinkVM</span>     microVM monitor in C (Linux KVM, QEMU) \u2192 <a class="term__link" href="https://github.com/SaiChappidi/BlinkVM" target="_blank" rel="noopener">github</a>',
        '  <span class="term__key">SplitTheBill</span> Rails expense splitter \u2192 <a class="term__link" href="https://github.com/SaiChappidi/SplitTheBill" target="_blank" rel="noopener">github</a>',
        '  <span class="term__key">RescueAI</span>    YOLOv8 + Q-learning S&amp;R \u2192 <a class="term__link" href="https://github.com/SaiChappidi/RescueAI" target="_blank" rel="noopener">github</a>',
        '<span class="term__muted">Run</span> <span class="term__cmd">goto projects</span> <span class="term__muted">to see the full cards.</span>',
      ];
    },
    skills() {
      return [
        '<span class="term__head">Skills</span>',
        '<span class="term__key">Languages</span>  Java · Python · C/C++ · C# · JavaScript · Apex · SQL · Ruby',
        '<span class="term__key">Web</span>        React · Node.js · Rails · ASP.NET · Tailwind',
        '<span class="term__key">Cloud/Tools</span> Salesforce · Azure · Docker · Git · PostgreSQL · CI/CD',
      ];
    },
    experience() {
      return [
        '<span class="term__head">Experience</span>',
        '  <span class="term__key">WineDirect</span>   SWE Intern \u2014 Salesforce flows &amp; Apex (2025)',
        '  <span class="term__key">J-To-A</span>       Co-founder &amp; Board Member (2021\u2013present)',
        '  <span class="term__key">Code Ninjas</span>  Coding Sensei \u2014 50+ kids (2023\u20132026)',
      ];
    },
    education() {
      return [
        '<span class="term__head">Education</span>',
        "The Ohio State University \u2014 B.S. Computer Science &amp; Engineering",
        "Expected May 2027 · Columbus, OH",
        "Cert: Salesforce Certified Agentforce Specialist",
      ];
    },
    resume() {
      window.open("Sai_Chappidi_Portfolio_Resume.pdf", "_blank");
      return ['<span class="term__ok">Opening résumé.pdf in a new tab\u2026</span>'];
    },
    contact() {
      return [
        '<span class="term__head">Contact</span>',
        '  email   <a class="term__link" href="mailto:saisrisuhas.chappidi@gmail.com">saisrisuhas.chappidi@gmail.com</a>',
      ];
    },
    social() {
      return [
        '  github   <a class="term__link" href="https://github.com/SaiChappidi" target="_blank" rel="noopener">github.com/SaiChappidi</a>',
        '  linkedin <a class="term__link" href="https://www.linkedin.com/in/saichappidi12" target="_blank" rel="noopener">linkedin.com/in/saichappidi12</a>',
      ];
    },
    theme(arg) {
      const map = { aurora: "", default: "", green: "green", blue: "blue", salesforce: "blue", synth: "synth", synthwave: "synth" };
      if (arg && arg in map) {
        applyTheme(map[arg]);
        return ['<span class="term__ok">Theme set to ' + (THEMES.find((t) => t.id === map[arg]).name) + '.</span>'];
      }
      return [
        '<span class="term__muted">Usage:</span> theme &lt;aurora|green|blue|synth&gt;',
        '<span class="term__muted">Or just click the theme chip in the navbar.</span>',
      ];
    },
    goto(arg) {
      const valid = ["about", "experience", "projects", "skills", "contact", "home"];
      if (arg && valid.includes(arg)) {
        const el = document.getElementById(arg);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        return ['<span class="term__ok">Navigating to #' + arg + '\u2026</span>'];
      }
      return ['<span class="term__err">Unknown section.</span> Try: ' + valid.join(", ")];
    },
    whoami() { return ["visitor@saichappidi \u2014 but the real question is, are you hiring? \uD83D\uDE09"]; },
    sudo() { return ['<span class="term__err">Nice try.</span> Permission denied.']; },
    ls() { return ["about  projects  skills  experience  education  resume.pdf  contact"]; },
    echo(arg, raw) { return [raw || ""]; },
    clear() { body.innerHTML = INTRO_LINE; return null; },
  };
  const ALIASES = { "?": "help", man: "help", work: "experience", school: "education", cv: "resume", email: "contact", github: "social", linkedin: "social", proj: "projects" };

  function run(raw) {
    const trimmed = raw.trim();
    print('<span class="term__echo"><span class="term__prompt">visitor@sai<span class="term__path">~</span>$</span> ' + escapeHtml(trimmed) + "</span>");
    if (!trimmed) return;
    const [cmdRaw, ...rest] = trimmed.split(/\s+/);
    const arg = (rest[0] || "").toLowerCase();
    const cmd = ALIASES[cmdRaw.toLowerCase()] || cmdRaw.toLowerCase();
    const fn = COMMANDS[cmd];
    if (!fn) {
      print('<span class="term__err">command not found: ' + escapeHtml(cmdRaw) + '</span> \u2014 type <span class="term__cmd">help</span>');
      return;
    }
    const out = fn(arg, rest.join(" "));
    if (out) printBlock(out);
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = input.value;
      if (val.trim()) { history.unshift(val); hIdx = -1; }
      run(val);
      input.value = "";
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (hIdx < history.length - 1) { hIdx++; input.value = history[hIdx]; }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIdx > 0) { hIdx--; input.value = history[hIdx]; }
      else { hIdx = -1; input.value = ""; }
    }
  });

  if (term) term.addEventListener("click", (e) => {
    if (e.target.tagName !== "A") input.focus();
  });
})();

/* =====================================================================
   COMMAND PALETTE (⌘K)
   ===================================================================== */
(function palette() {
  const root = document.getElementById("palette");
  const backdrop = document.getElementById("paletteBackdrop");
  const inputEl = document.getElementById("paletteInput");
  const listEl = document.getElementById("paletteList");
  const openBtn = document.getElementById("openPalette");
  if (!root || !inputEl || !listEl) return;

  const go = (id) => () => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth" }); };
  const open = (url) => () => window.open(url, "_blank");

  const ITEMS = [
    { icon: "\u2192", title: "Go to About", hint: "Section", tag: "nav", run: go("about"), keys: "about" },
    { icon: "\u2192", title: "Go to Experience", hint: "Section", tag: "nav", run: go("experience"), keys: "experience work jobs" },
    { icon: "\u2192", title: "Go to Projects", hint: "Section", tag: "nav", run: go("projects"), keys: "projects work portfolio" },
    { icon: "\u2192", title: "Go to Skills", hint: "Section", tag: "nav", run: go("skills"), keys: "skills tech stack" },
    { icon: "\u2192", title: "Go to Contact", hint: "Section", tag: "nav", run: go("contact"), keys: "contact reach" },
    { icon: "\uD83D\uDCC4", title: "View résumé", hint: "Opens PDF", tag: "file", run: open("Sai_Chappidi_Portfolio_Resume.pdf"), keys: "resume cv pdf" },
    { icon: "\u2B07", title: "Download résumé", hint: "PDF", tag: "file", run: () => { const a = document.createElement("a"); a.href = "Sai_Chappidi_Portfolio_Resume.pdf"; a.download = "Sai_Chappidi_Portfolio_Resume.pdf"; a.click(); }, keys: "download resume cv" },
    { icon: "\u2709", title: "Email Sai", hint: "saisrisuhas.chappidi@gmail.com", tag: "link", run: open("mailto:saisrisuhas.chappidi@gmail.com"), keys: "email mail contact" },
    { icon: "\u29C9", title: "Copy email address", hint: "to clipboard", tag: "action", run: copyEmail, keys: "copy email clipboard" },
    { icon: "\u2387", title: "Open GitHub", hint: "github.com/SaiChappidi", tag: "link", run: open("https://github.com/SaiChappidi"), keys: "github code repos" },
    { icon: "in", title: "Open LinkedIn", hint: "linkedin.com/in/saichappidi12", tag: "link", run: open("https://www.linkedin.com/in/saichappidi12"), keys: "linkedin" },
    { icon: "\u25D0", title: "Theme: Aurora", hint: "cyan · violet · pink", tag: "theme", run: () => applyTheme(""), keys: "theme aurora default" },
    { icon: "\u25D0", title: "Theme: Terminal Green", hint: "matrix vibes", tag: "theme", run: () => applyTheme("green"), keys: "theme green terminal" },
    { icon: "\u25D0", title: "Theme: Salesforce Blue", hint: "ocean blue", tag: "theme", run: () => applyTheme("blue"), keys: "theme blue salesforce" },
    { icon: "\u25D0", title: "Theme: Synthwave", hint: "retro neon", tag: "theme", run: () => applyTheme("synth"), keys: "theme synth synthwave retro" },
  ];

  let filtered = ITEMS.slice();
  let active = 0;

  function copyEmail() {
    navigator.clipboard?.writeText("saisrisuhas.chappidi@gmail.com");
  }

  function render() {
    listEl.innerHTML = "";
    if (!filtered.length) {
      listEl.innerHTML = '<li class="palette__empty">No matching commands</li>';
      return;
    }
    filtered.forEach((item, i) => {
      const li = document.createElement("li");
      li.className = "palette__item" + (i === active ? " active" : "");
      li.innerHTML =
        '<span class="palette__item-ico">' + item.icon + "</span>" +
        '<span class="palette__item-text"><b>' + item.title + "</b><small>" + item.hint + "</small></span>" +
        '<span class="palette__item-tag">' + item.tag + "</span>";
      li.addEventListener("click", () => { item.run(); close(); });
      li.addEventListener("pointermove", () => { active = i; highlight(); });
      listEl.appendChild(li);
    });
  }
  function highlight() {
    [...listEl.children].forEach((c, i) => c.classList.toggle("active", i === active));
    const el = listEl.children[active];
    if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
  }
  function filter(q) {
    q = q.trim().toLowerCase();
    filtered = !q ? ITEMS.slice() : ITEMS.filter((it) => (it.title + " " + it.keys + " " + it.tag).toLowerCase().includes(q));
    active = 0;
    render();
  }
  function open_() {
    root.hidden = false;
    inputEl.value = "";
    filter("");
    setTimeout(() => inputEl.focus(), 20);
  }
  function close() { root.hidden = true; }
  function isOpen() { return !root.hidden; }

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      isOpen() ? close() : open_();
      return;
    }
    if (e.key === "/" && !isOpen() && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      e.preventDefault();
      open_();
      return;
    }
    if (!isOpen()) return;
    if (e.key === "Escape") { close(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(active + 1, filtered.length - 1); highlight(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(active - 1, 0); highlight(); }
    else if (e.key === "Enter") { e.preventDefault(); if (filtered[active]) { filtered[active].run(); close(); } }
  });
  inputEl.addEventListener("input", () => filter(inputEl.value));
  backdrop.addEventListener("click", close);
  if (openBtn) openBtn.addEventListener("click", open_);
})();
