/**
 * Reviews: first quote visible on load; later quotes slide in from the right
 * over the same sticky stage as you scroll the track.
 */
(function () {
  var section = document.querySelector(".reviews-scroll");
  var track = document.querySelector(".reviews-scroll-track");
  var slides = Array.prototype.slice.call(document.querySelectorAll(".review-slide"));
  if (!section || !track || slides.length < 2) return;

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  var ENTER_SPAN = 0.38;
  var header = document.querySelector(".site-header");

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function syncStickyFromHeader() {
    if (!header) return;
    var next = Math.ceil(header.getBoundingClientRect().height + 8) + "px";
    if (section.style.getPropertyValue("--review-sticky-top") !== next) {
      section.style.setProperty("--review-sticky-top", next);
    }
  }

  function trackProgress() {
    var stickyRaw = getComputedStyle(section).getPropertyValue("--review-sticky-top").trim();
    var sticky = parseFloat(stickyRaw);
    if (!Number.isFinite(sticky)) sticky = 96;

    var top = track.getBoundingClientRect().top + window.scrollY;
    var start = top - sticky;
    var end = top + track.offsetHeight - window.innerHeight;
    var range = end - start;
    if (range <= 1) return window.scrollY >= start ? 1 : 0;
    return clamp((window.scrollY - start) / range, 0, 1);
  }

  function hideOffRight(review) {
    review.style.transform = "translate3d(115%, 0, 0)";
    review.style.opacity = "0";
    review.classList.remove("is-active");
  }

  function applyEnter(review, t) {
    var eased = easeOut(clamp(t, 0, 1));
    /* Opaque while sliding so the previous quote does not ghost through. */
    review.style.transform = "translate3d(" + (1 - eased) * 115 + "%, 0, 0)";
    review.style.opacity = "1";
    review.classList.add("is-active");
  }

  function showCentered(review) {
    review.style.transform = "translate3d(0, 0, 0)";
    review.style.opacity = "1";
    review.classList.add("is-active");
  }

  function update() {
    syncStickyFromHeader();
    var progress = trackProgress();
    var steps = slides.length - 1;
    var scaled = progress * steps;
    var current = Math.floor(scaled);
    if (current >= steps) current = steps - 1;
    var local = current >= steps - 1 && progress >= 1 ? 1 : scaled - current;

    slides.forEach(function (slide, index) {
      if (index === 0) {
        showCentered(slide);
        return;
      }

      var stepIndex = index - 1;
      if (current < stepIndex) {
        hideOffRight(slide);
        return;
      }

      if (current > stepIndex) {
        showCentered(slide);
        return;
      }

      var hold = 1 - ENTER_SPAN;
      if (local < hold) {
        hideOffRight(slide);
      } else {
        applyEnter(slide, (local - hold) / ENTER_SPAN);
      }
    });
  }

  var ticking = false;
  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        update();
      });
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
