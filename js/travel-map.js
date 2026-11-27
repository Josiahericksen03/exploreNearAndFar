/**
 * Travel map — Leaflet + OpenStreetMap basemap.
 * Pin kinds: explored | planned | both
 */
(function () {
  var roots = Array.prototype.slice.call(document.querySelectorAll("[data-travel-map]"));
  if (!roots.length) return;

  var DESTINATIONS = [
    {
      id: "frankfurt",
      name: "Frankfurt",
      kind: "explored",
      lat: 50.1109,
      lng: 8.6821,
      image: "assets/photos/map/frankfurt.jpg",
      blurb: "Gateway days in Germany — city walks and the start of river itineraries we’ve taken ourselves.",
    },
    {
      id: "nuremberg",
      name: "Nuremberg",
      kind: "explored",
      lat: 49.4529,
      lng: 11.0765,
      image: "assets/photos/map/nuremberg.jpg",
      blurb: "Old Town lanes and castle views from our own travels through Bavaria.",
    },
    {
      id: "linz",
      name: "Linz",
      kind: "explored",
      lat: 48.3069,
      lng: 14.2858,
      image: "assets/photos/map/linz.jpg",
      blurb: "A Danube stop we’ve walked ourselves — quieter streets and an easy Austrian pace.",
    },
    {
      id: "vienna",
      name: "Vienna",
      kind: "explored",
      lat: 48.2082,
      lng: 16.3738,
      image: "assets/photos/map/vienna.jpg",
      blurb: "Looking out over Stephansplatz — a Vienna city day from trips we’ve taken ourselves.",
    },
    {
      id: "bratislava",
      name: "Bratislava",
      kind: "explored",
      lat: 48.1429,
      lng: 17.1089,
      image: "assets/photos/map/bratislava.jpg",
      blurb: "Čumil, the famous “man at work” statue — a Bratislava street stop from our own travels.",
    },
    {
      id: "budapest",
      name: "Budapest",
      kind: "explored",
      lat: 47.5021,
      lng: 19.035,
      image: "assets/photos/map/budapest.jpg",
      blurb: "Fisherman’s Bastion views and Danube evenings from our own travels through Hungary.",
    },
    {
      id: "blaskogabyggd",
      name: "Bláskógabyggð",
      kind: "explored",
      lat: 64.259,
      lng: -20.35,
      image: "assets/photos/map/blaskogabyggd.jpg",
      blurb: "Golden Circle country — geysers, waterfalls, and open Icelandic landscape we’ve explored firsthand.",
    },
    {
      id: "reykjavik",
      name: "Reykjavík",
      kind: "explored",
      lat: 64.1466,
      lng: -21.9426,
      image: "assets/photos/map/reykjavik.jpg",
      blurb: "Harbor walks, local food, and the base for scenic road trips we’ve taken in Iceland.",
    },
    {
      id: "isafjordur",
      name: "Ísafjörður",
      kind: "explored",
      lat: 66.0625,
      lng: -23.2074,
      image: "assets/photos/map/isafjordur.jpg",
      blurb: "Westfjords scenery and a quieter Icelandic port stop from our own sailing days.",
    },
    {
      id: "akureyri",
      name: "Akureyri",
      kind: "explored",
      lat: 65.6835,
      lng: -18.1002,
      image: "assets/photos/map/akureyri.jpg",
      blurb: "Northern Iceland’s capital — fjord views and day trips we’ve experienced ourselves.",
    },
    {
      id: "castlerock",
      name: "Castlerock, Northern Ireland",
      kind: "explored",
      lat: 55.164,
      lng: -6.785,
      image: "assets/photos/map/castlerock.jpg",
      blurb: "A stop at Tucker’s Inn in Castlerock — coastal Northern Ireland from our own travels.",
    },
    {
      id: "edinburgh",
      name: "Edinburgh",
      kind: "explored",
      lat: 55.9533,
      lng: -3.1883,
      image: "assets/photos/map/edinburgh.jpg",
      blurb: "Castle rock, Royal Mile walks, and neighborhood meals from trips we’ve taken together.",
    },
    {
      id: "amsterdam",
      name: "Amsterdam",
      kind: "explored",
      lat: 52.3784,
      lng: 4.8988,
      image: "assets/photos/map/amsterdam.jpg",
      blurb: "Canal-side stays and neighborhood walks we’ve enjoyed and love to plan for others.",
    },
    {
      id: "portsmouth",
      name: "Portsmouth",
      kind: "explored",
      lat: 50.794,
      lng: -1.1046,
      image: "assets/photos/map/portsmouth.jpg",
      blurb: "Harbor history and English seaside days from our own UK travels.",
    },
    {
      id: "detroit",
      name: "Detroit",
      kind: "explored",
      lat: 42.3314,
      lng: -83.0458,
      image: "assets/photos/map/detroit.jpg",
      blurb: "A Detroit city day from our own travels — neighborhoods and landmarks up close.",
    },
    {
      id: "cleveland",
      name: "Cleveland",
      kind: "explored",
      lat: 41.4993,
      lng: -81.6944,
      image: "assets/photos/map/cleveland.jpg",
      blurb: "Lake Erie days and downtown exploring from our own Midwest travels.",
    },
    {
      id: "solola",
      name: "Sololá, Guatemala",
      kind: "planned",
      lat: 14.7729,
      lng: -91.1832,
      image: "assets/photos/map/solola.jpg",
      blurb: "A client journey we planned — highland towns, markets, and travel details handled end to end.",
    },
    {
      id: "savannah",
      name: "Savannah",
      kind: "explored",
      lat: 32.0809,
      lng: -81.0912,
      image: "assets/photos/map/savannah.jpg",
      blurb: "Square-by-square walks and Southern evenings from a trip we’ve taken ourselves.",
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
    var pins = preview ? DESTINATIONS.slice(0, 6) : DESTINATIONS;

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
      map.fitBounds(bounds, {
        padding: preview ? [36, 36] : [56, 56],
        maxZoom: preview ? 3 : 4,
      });
    } else {
      map.setView([28, -40], 2);
    }

    setTimeout(function () {
      map.invalidateSize();
    }, 80);
  }

  loadLeaflet(function () {
    roots.forEach(buildMap);
  });
})();
