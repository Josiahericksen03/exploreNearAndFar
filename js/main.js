(function () {
  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var tripSelect = document.getElementById("trip-type");
  if (tripSelect) {
    var tripParam = new URLSearchParams(window.location.search).get("trip");
    if (tripParam && tripSelect.querySelector('option[value="' + tripParam + '"]')) {
      tripSelect.value = tripParam;
    }
  }

  var form = document.getElementById("trip-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var valid = true;
    var groups = form.querySelectorAll(".form-group[data-required]");
    groups.forEach(function (group) {
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
        status.textContent = "Please fill in the required fields below.";
        status.focus();
      }
      return;
    }
    if (status) {
      status.textContent =
        "Thank you — this is a mockup, so nothing was sent. On the live site, Faith and Rob will reach out within one business day.";
    }
    form.reset();
    if (tripSelect && tripParam && tripSelect.querySelector('option[value="' + tripParam + '"]')) {
      tripSelect.value = tripParam;
    }
  });
})();
