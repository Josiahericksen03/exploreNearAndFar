/**
 * Travel map — Leaflet + OpenStreetMap basemap.
 * Pin kinds: explored | planned | both
 */
(function () {
  var roots = Array.prototype.slice.call(document.querySelectorAll("[data-travel-map]"));
  if (!roots.length) return;

  var DESTINATIONS = [
    {
      id: "budapest",
      name: "Budapest",
      kind: "explored",
      lat: 47.4979,
      lng: 19.0402,
      image: "assets/photos/image01.jpg",
      blurb: "Fisherman’s Bastion views and Danube evenings from our own travels through Hungary.",
    },
    {
      id: "barcelona",
      name: "Barcelona",
      kind: "explored",
      lat: 41.3874,
      lng: 2.1686,
      image: "assets/photos/image05.jpg",
      blurb: "Sagrada Família, neighborhood walks, and the kind of city pacing we love to plan.",
    },
    {
      id: "venice",
      name: "Venice",
      kind: "explored",
      lat: 45.4408,
      lng: 12.3155,
      image: "assets/photos/image18.jpg",
      blurb: "Canal days and gondola evenings we’ve experienced firsthand and share with clients.",
    },
    {
      id: "paris",
      name: "Paris",
      kind: "explored",
      lat: 48.8566,
      lng: 2.3522,
      image: "assets/photos/image07.jpg",
      blurb: "Landmark evenings and neighborhood meals from trips we’ve taken together.",
    },
    {
      id: "malaga",
      name: "Málaga",
      kind: "explored",
      lat: 36.7213,
      lng: -4.4214,
      image: "assets/photos/image03.jpg",
      blurb: "Rooftop views over cathedral towers and a slower Spanish coastal pace.",
    },
    {
      id: "bahamas",
      name: "Bimini &amp; Nassau",
      kind: "both",
      lat: 25.0667,
      lng: -77.3333,
      image: "assets/photos/image02.jpg",
      blurb: "Beach-club days and Virgin Voyages sailings we’ve taken and booked for travelers.",
    },
    {
      id: "amsterdam",
      name: "Amsterdam",
      kind: "both",
      lat: 52.3676,
      lng: 4.9041,
      image: "assets/destination-amsterdam-tulips.png",
      blurb: "Neighborhood walks, tulip season timing, and canal-side stays we’ve enjoyed and planned.",
    },
    {
      id: "mediterranean",
      name: "French Riviera",
      kind: "planned",
      lat: 43.7384,
      lng: 7.4246,
      image: "assets/destination-monte-carlo-harbor.png",
      blurb: "Harbor stays and coastal cruise embarkations planned for clients seeking a polished Mediterranean week.",
    },
    {
      id: "niagara",
      name: "Niagara Falls",
      kind: "explored",
      lat: 43.0962,
      lng: -79.0377,
      image: "assets/destination-niagara-falls.png",
      blurb: "A classic near-and-far getaway we’ve walked ourselves — mist, viewpoints, and an easy pace.",
    },
    {
      id: "antarctica",
      name: "Antarctic waters",
      kind: "planned",
      lat: -64.85,
      lng: -62.9,
      image: "assets/cruise-viking-expedition-antarctica.png",
      blurb: "Expedition cruise planning for clients — cabin fit, pacing, and what the voyage really asks of you.",
    },
  ];

  function kindLabel(kind) {
    if (kind === "explored") return "Personally explored";
    if (kind === "planned") return "Planned for clients";
    return "Explored &amp; planned";
  }

  function loadLeaflet(done) {
    if (window.L) {
      done();
      return;
    }

    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    css.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    css.crossOrigin = "";
    document.head.appendChild(css);

    var script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.onload = done;
    script.onerror = function () {
      roots.forEach(function (root) {
        root.innerHTML =
          '<p class="map-fallback">Map could not load. Check your network connection, then refresh.</p>';
      });
    };
    document.head.appendChild(script);
  }

  function pinIcon(kind) {
    return window.L.divIcon({
      className: "travel-pin travel-pin--" + kind,
      html: '<span class="travel-pin-dot" aria-hidden="true"></span>',
      iconSize: [22, 22],
      iconAnchor: [11, 20],
      popupAnchor: [0, -18],
    });
  }

  function cardHtml(dest) {
    return (
      '<div class="travel-map-popup">' +
      '<div class="travel-map-card-media"><img src="' +
      dest.image +
      '" alt=""></div>' +
      '<p class="travel-map-card-kind">' +
      kindLabel(dest.kind) +
      "</p>" +
      "<h3>" +
      dest.name +
      "</h3>" +
      "<p>" +
      dest.blurb +
      "</p>" +
      '<p class="actions"><a class="btn btn-primary" href="plan-your-trip.html?trip=other">Plan a trip here</a></p>' +
      "</div>"
    );
  }

  function buildMap(root) {
    var preview = root.getAttribute("data-travel-map") === "preview";
    var pins = preview ? DESTINATIONS.slice(0, 4) : DESTINATIONS;

    root.innerHTML = "";
    var canvas = document.createElement("div");
    canvas.className = "travel-map-canvas";
    canvas.setAttribute("role", "region");
    canvas.setAttribute(
      "aria-label",
      "Map of destinations Faith and Rob have explored or planned"
    );
    root.appendChild(canvas);

    var map = window.L.map(canvas, {
      scrollWheelZoom: !preview,
      dragging: !preview,
      doubleClickZoom: !preview,
      boxZoom: !preview,
      keyboard: !preview,
      zoomControl: !preview,
      attributionControl: true,
    });

    window.L
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: "abc",
        maxZoom: 12,
        minZoom: 1,
      })
      .addTo(map);

    var bounds = [];

    pins.forEach(function (dest) {
      var marker = window.L.marker([dest.lat, dest.lng], {
        icon: pinIcon(dest.kind),
        title: dest.name.replace(/&amp;/g, "&"),
        keyboard: true,
        riseOnHover: true,
      }).addTo(map);

      bounds.push([dest.lat, dest.lng]);

      if (preview) {
        marker.on("click", function () {
          window.location.href = "about.html#travels";
        });
      } else {
        marker.bindPopup(cardHtml(dest), {
          maxWidth: 280,
          className: "travel-map-leaflet-popup",
          autoPanPadding: [24, 24],
        });
      }
    });

    if (bounds.length) {
      /* Keep the first view on the main travel belt; Antarctica stays on the map if you pan/zoom. */
      var focus = bounds.filter(function (pair) {
        return pair[0] > -40;
      });
      map.fitBounds(focus.length ? focus : bounds, {
        padding: preview ? [36, 36] : [56, 56],
        maxZoom: preview ? 3 : 3,
      });
    } else {
      map.setView([28, -40], 2);
    }

    /* Leaflet needs a resize pass after sticky/layout settles. */
    setTimeout(function () {
      map.invalidateSize();
    }, 80);
  }

  loadLeaflet(function () {
    roots.forEach(buildMap);
  });
})();
