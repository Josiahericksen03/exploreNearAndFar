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

  /* Hero videos: fade in only after frames are ready (avoids poster flash). */
  document.querySelectorAll(".page-hero-video").forEach(function (video) {
    var markReady = function () {
      video.classList.add("is-ready");
    };
    if (video.readyState >= 2) {
      markReady();
    } else {
      video.addEventListener("loadeddata", markReady, { once: true });
      video.addEventListener("playing", markReady, { once: true });
    }
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  });

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

  var tripParam = new URLSearchParams(window.location.search).get("trip");
  var tripChecks = document.querySelectorAll('input[name="trip-type"][type="checkbox"]');
  if (tripParam && tripChecks.length) {
    tripChecks.forEach(function (box) {
      if (box.value === tripParam) box.checked = true;
    });
  }

  var form = document.getElementById("trip-form");
  if (!form) return;

  var tripLabels = {
    wedding: "Wedding travel",
    senior: "Senior travel",
    accessible: "Accessible travel",
    cruise: "Cruise",
    land: "Land vacation",
    other: "Other vacation",
  };

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var valid = true;
    form.querySelectorAll(".form-group[data-required]").forEach(function (group) {
      if (group.hasAttribute("data-trip-types")) {
        var any = group.querySelectorAll('input[type="checkbox"]:checked').length > 0;
        if (!any) {
          group.classList.add("invalid");
          valid = false;
        } else {
          group.classList.remove("invalid");
        }
        return;
      }
      var input = group.querySelector("input, select, textarea");
      if (!input || !String(input.value || "").trim()) {
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

    var name = (form.querySelector("#name") || {}).value || "";
    var email = (form.querySelector("#email") || {}).value || "";
    var phone = (form.querySelector("#phone") || {}).value || "";
    var message = (form.querySelector("#message") || {}).value || "";
    var selected = Array.prototype.slice
      .call(form.querySelectorAll('input[name="trip-type"]:checked'))
      .map(function (box) {
        return tripLabels[box.value] || box.value;
      });

    var body =
      "Name: " +
      name.trim() +
      "\n" +
      "Email: " +
      email.trim() +
      "\n" +
      "Phone: " +
      (phone.trim() || "(not provided)") +
      "\n" +
      "Interested in: " +
      selected.join(", ") +
      "\n\n" +
      "Message:\n" +
      message.trim();

    var mailto =
      "mailto:explorenearandfartravel@gmail.com" +
      "?subject=" +
      encodeURIComponent("Trip inquiry from " + name.trim()) +
      "&body=" +
      encodeURIComponent(body);

    window.location.href = mailto;

    if (status) {
      status.textContent =
        "Opening your email to explorenearandfartravel@gmail.com with your message and selected trip types. If nothing opens, email us directly.";
      status.focus();
    }
  });
})();
