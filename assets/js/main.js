/* ==========================================================================
   DocuForge — site behaviour
   Vanilla JS. No dependencies.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;

  /* ---------- Theme ---------- */
  var STORAGE_KEY = "docuforge-theme";

  function systemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function storedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var meta = doc.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0b0f19" : "#ffffff");
    doc.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    });
  }

  applyTheme(storedTheme() || systemTheme());

  doc.addEventListener("click", function (event) {
    var toggle = event.target.closest("[data-theme-toggle]");
    if (!toggle) return;
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      /* storage blocked — theme still applies for this page view */
    }
    applyTheme(next);
  });

  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onChange = function (event) {
      if (!storedTheme()) applyTheme(event.matches ? "dark" : "light");
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---------- Mobile navigation ---------- */
  var navToggle = doc.querySelector("[data-nav-toggle]");
  var navLinks = doc.getElementById("primary-nav");

  function closeNav() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navLinks.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) closeNav();
    });
  }

  /* ---------- Mark the current page in the nav ---------- */
  var here = window.location.pathname.replace(/\/+$/, "") || "/index.html";
  doc.querySelectorAll(".nav__links a").forEach(function (link) {
    var path = link.getAttribute("href");
    if (!path || path.charAt(0) === "#") return;
    var resolved = new URL(path, window.location.href).pathname.replace(/\/+$/, "") || "/index.html";
    if (resolved === here || (here === "/" && resolved === "/index.html")) {
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---------- Scroll reveal ---------- */
  var revealables = doc.querySelectorAll(".reveal");
  if (revealables.length) {
    if (!("IntersectionObserver" in window)) {
      revealables.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      revealables.forEach(function (el) {
        observer.observe(el);
      });
    }
  }

  /* ---------- Copy-to-clipboard buttons ---------- */
  doc.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-copy]");
    if (!btn) return;
    var value = btn.getAttribute("data-copy");
    var label = btn.getAttribute("data-copy-label") || "Copy";

    var done = function () {
      var original = btn.textContent;
      btn.textContent = "Copied";
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = original || label;
        btn.disabled = false;
      }, 1600);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(done, function () {
        window.prompt("Copy this value:", value);
      });
      return;
    }

    var field = doc.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    doc.body.appendChild(field);
    field.select();
    try {
      doc.execCommand("copy");
      done();
    } catch (e) {
      window.prompt("Copy this value:", value);
    }
    doc.body.removeChild(field);
  });

  /* ---------- Footer year ---------- */
  doc.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Contact form (static sites have no backend) ----------
     Builds a mailto: link from the fields, then hands off to the mail app.
     Replace this with Formspree / Netlify Forms / your own endpoint later. */
  var contactForm = doc.querySelector("[data-mailto-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var to = contactForm.getAttribute("data-mailto-form");
      var data = new FormData(contactForm);
      var subject = (data.get("subject") || "Website enquiry").toString();
      var bodyLines = [];
      data.forEach(function (value, key) {
        if (key === "subject") return;
        bodyLines.push(key + ": " + value);
      });
      var href =
        "mailto:" +
        to +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(bodyLines.join("\n"));
      window.location.href = href;
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = doc.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.style.boxShadow = window.scrollY > 8 ? "var(--shadow-sm)" : "none";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
})();
