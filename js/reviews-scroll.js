/**
 * Reviews: first quote visible on load; later quotes slide in from the right.
 */
(function () {
  var chapters = Array.prototype.slice.call(document.querySelectorAll(".review-chapter"));
  if (!chapters.length) return;

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var PREV_RELEASE = 0.44;
  /* Fraction of previous chapter scroll used for translateX 115% → 0 */
  var HANDOFF_SPAN = 0.38;

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function chapterProgress(chapter) {
    var vh = window.innerHeight;
    var top = chapter.offsetTop;
    var range = chapter.offsetHeight - vh;
    if (range <= 0) return 1;
    return clamp((window.scrollY - top) / range, 0, 1);
  }

  function hideOffRight(review) {
    review.style.transform = "translate3d(115%, 0, 0)";
    review.style.opacity = "0";
  }

  function applyEnter(review, t) {
    var eased = easeOut(clamp(t, 0, 1));
    review.style.transform = "translate3d(" + (1 - eased) * 115 + "%, 0, 0)";
    review.style.opacity = String(0.15 + eased * 0.85);
  }

  function showCentered(review) {
    review.style.transform = "translate3d(0, 0, 0)";
    review.style.opacity = "1";
  }

  function updateChapter(chapter, index) {
    var review = chapter.querySelector(".review-slide");
    if (!review) return;

    if (index === 0) {
      showCentered(review);
      return;
    }

    var prevProgress = chapterProgress(chapters[index - 1]);

    if (prevProgress < PREV_RELEASE) {
      hideOffRight(review);
      return;
    }

    var enterT = clamp((prevProgress - PREV_RELEASE) / HANDOFF_SPAN, 0, 1);

    if (enterT < 1) {
      applyEnter(review, enterT);
    } else {
      showCentered(review);
    }
  }

  function update() {
    if (prefersReduced) return;
    chapters.forEach(updateChapter);
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

  if (prefersReduced) return;

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
