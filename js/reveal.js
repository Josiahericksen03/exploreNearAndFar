/**
 * Scroll-triggered reveals. Add data-reveal="up|down|left|right|fade" and optional data-reveal-delay="0.2" on any element.
 * Common blocks (cards, splits, certs, etc.) are auto-tagged on each page load.
 */
(function () {
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var toObserve = [];

  function markVisible(el) {
    el.classList.add("is-visible");
  }

  function register(el, type, delaySeconds, immediate) {
    if (!el || el.classList.contains("reveal")) return;
    el.classList.add("reveal", "reveal--" + type);
    if (delaySeconds) {
      el.style.setProperty("--reveal-delay", delaySeconds + "s");
    }
    if (prefersReduced || immediate) {
      markVisible(el);
      return;
    }
    toObserve.push(el);
  }

  document.querySelectorAll(".hero-inner > *").forEach(function (el, i) {
    register(el, i % 2 === 0 ? "up" : "fade", i * 0.12, prefersReduced);
    if (!prefersReduced) {
      window.setTimeout(function () {
        markVisible(el);
      }, 80 + i * 120);
    }
  });

  document.querySelectorAll(".page-hero-inner > *").forEach(function (el, i) {
    register(el, "up", i * 0.1, prefersReduced);
    if (!prefersReduced) {
      window.setTimeout(function () {
        markVisible(el);
      }, 60 + i * 100);
    }
  });

  document.querySelectorAll(".trust-list li").forEach(function (el, i) {
    register(el, i % 2 ? "right" : "left", i * 0.08, false);
  });

  document.querySelectorAll(".card").forEach(function (el, i) {
    register(el, "up", i * 0.1, false);
  });

  document.querySelectorAll(".section-inner > .section-eyebrow").forEach(function (el) {
    register(el, "fade", 0, false);
  });
  document.querySelectorAll(".section-inner > .section-title").forEach(function (el) {
    register(el, "up", 0.08, false);
  });
  document.querySelectorAll(".section-inner > .section-intro").forEach(function (el) {
    register(el, "fade", 0.16, false);
  });

  document.querySelectorAll(".split").forEach(function (split) {
    var kids = split.children;
    if (kids.length >= 2) {
      register(kids[0], "left", 0, false);
      register(kids[1], "right", 0.12, false);
    }
  });

  document.querySelectorAll(".cert-row img").forEach(function (el, i) {
    register(el, "fade", i * 0.07, false);
  });
  document.querySelectorAll(".cert-partners-title").forEach(function (el) {
    register(el, "fade", 0.3, false);
  });

  document.querySelectorAll(".review").forEach(function (el, i) {
    if (el.closest(".reviews-scroll")) return;
    register(el, i % 2 ? "right" : "left", i * 0.1, false);
  });

  document.querySelectorAll(".cta-band > *").forEach(function (el, i) {
    register(el, "up", i * 0.1, false);
  });

  document.querySelectorAll(".service-note").forEach(function (el) {
    register(el, "fade", 0.15, false);
  });

  document.querySelectorAll(".section-teal .actions, .section-wash .actions").forEach(function (el) {
    register(el, "fade", 0.22, false);
  });

  document.querySelectorAll(".feature-list li").forEach(function (el, i) {
    register(el, "up", i * 0.07, false);
  });

  document.querySelectorAll(".form-panel").forEach(function (el) {
    register(el, "left", 0, false);
  });

  document.querySelectorAll(".footer-inner > div").forEach(function (el, i) {
    register(el, "up", i * 0.08, false);
  });

  document.querySelectorAll("[data-reveal]").forEach(function (el) {
    var type = el.getAttribute("data-reveal") || "fade";
    var delay = parseFloat(el.getAttribute("data-reveal-delay") || "0", 10);
    register(el, type, delay, false);
  });

  if (prefersReduced || !toObserve.length) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          markVisible(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
  );

  toObserve.forEach(function (el) {
    if (!el.classList.contains("is-visible")) {
      observer.observe(el);
    }
  });
})();
