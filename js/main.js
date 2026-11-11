(function () {
  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("#site-nav") || document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
  }

  /* Home: draw the route once when it scrolls into view. */
  var route = document.querySelector(".route");
  if (route) {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var drawRoute = function () {
      if (route.classList.contains("is-drawn")) return;
      route.classList.add("is-drawn");
      window.removeEventListener("scroll", checkRoute);
      window.removeEventListener("resize", checkRoute);
    };
    var checkRoute = function () {
      var rect = route.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < vh * 0.75 && rect.bottom > 0) drawRoute();
    };
    if (reduced) {
      drawRoute();
    } else {
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                drawRoute();
                io.disconnect();
              }
            });
          },
          { threshold: 0.25 }
        );
        io.observe(route);
      }
      window.addEventListener("scroll", checkRoute, { passive: true });
      window.addEventListener("resize", checkRoute);
      checkRoute();
    }
  }

  var tripSelect = document.getElementById("trip-type");
  var tripParam = null;
  if (tripSelect) {
    tripParam = new URLSearchParams(window.location.search).get("trip");
    if (tripParam && tripSelect.querySelector('option[value="' + tripParam + '"]')) {
      tripSelect.value = tripParam;
    }
  }

  var form = document.getElementById("trip-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var valid = true;
    form.querySelectorAll(".field[data-required]").forEach(function (group) {
      var input = group.querySelector("input, select, textarea");
      if (!input || !input.value.trim()) {
        group.classList.add("invalid");
        valid = false;
      } else {
        group.classList.remove("invalid");
      }
    });
    var status = document.getElementById("form-status");
    if (!valid) {
      if (status) {
        status.textContent = "A few required fields are still empty — they are marked below.";
        status.focus();
      }
      return;
    }
    if (status) {
      status.textContent =
        "Thank you. This is a design mockup, so nothing was sent — on the live site Faith or Rob replies within one business day.";
      status.focus();
    }
    form.reset();
    if (tripSelect && tripParam && tripSelect.querySelector('option[value="' + tripParam + '"]')) {
      tripSelect.value = tripParam;
    }
  });
})();
