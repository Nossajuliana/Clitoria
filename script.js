/*==========================================================================
  Table of Contents
==========================================================================

  1. Constructor and Typing Animation
  2. Window Load Event Handler
  3. Document Ready Event Handlers
    3.1 Splash Screen Fade Out
    3.2 Toggle Profile Image Class

==========================================================================*/


// Constructor function for typing animation
var TxtType = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000; // Default period is 2000 milliseconds
  this.txt = "";
  this.tick(); // Start typing animation
  this.isDeleting = false;
};

// Method to handle typing animation
TxtType.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  // Update the typed text
  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  // Update the HTML element to display the typed text
  this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  // Adjust delta based on typing state
  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  // Schedule the next update
  setTimeout(function () {
    that.tick();
  }, delta);
};

// Run when the window is loaded
window.onload = function () {
  var elements = document.getElementsByClassName("typewrite");
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute("data-type");
    var period = elements[i].getAttribute("data-period");
    if (toRotate) {
      new TxtType(elements[i], JSON.parse(toRotate), period); // Initialize typing animation
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
  document.body.appendChild(css); // Add CSS for typing effect
};

// Inicializa Splash Logo - Run when the document is ready
$(document).ready(function () {
  // Show splash screen and fade out
  $("#splash-screen").delay(500).fadeOut("slow", function () {
    // Fade out the splash screen and show the main content
    $("#main-content").fadeIn("slow");
  });
});

// Run when the document is ready
$(document).ready(function () {
  const box = $(".profile-img");
  box.toggleClass(".profile-img-rev"); // Toggle a CSS class for the profile image
});


// Inicializa el objeto fathom
window.fathom = (function () {
    // Función para rastrear la vista de página
    function trackPageview() {
        window.fathom.trackPageview();
    }

    // Obtiene el script actual o el primer script que tenga un atributo específico
    var fathomScript = document.currentScript ||
        document.querySelector('script[src*="script.js"][site]') ||
        document.querySelector("script[data-site]") ||
        document.querySelector("script[site]");

    // Obtiene los atributos del script
    var siteId = fathomScript.getAttribute("data-site") || fathomScript.getAttribute("site"),
        honorDNT = false,
        auto = true,
        canonical = true,
        excludedDomains = [],
        allowedDomains = [];

    // Configuración de atributos opcionales
    if (fathomScript.getAttribute("data-honor-dnt") === "true" || fathomScript.getAttribute("honor-dnt") === "true") {
        honorDNT = "doNotTrack" in navigator && navigator.doNotTrack === "1";
    }

    if (fathomScript.getAttribute("data-auto") === "false" || fathomScript.getAttribute("auto") === "false") {
        auto = false;
    }

    if (fathomScript.getAttribute("data-canonical") === "false" || fathomScript.getAttribute("canonical") === "false") {
        canonical = false;
    }

    if (fathomScript.getAttribute("data-excluded-domains") || fathomScript.getAttribute("excluded-domains")) {
        excludedDomains = (fathomScript.getAttribute("data-excluded-domains") || fathomScript.getAttribute("excluded-domains")).split(",");
    }

    if (fathomScript.getAttribute("data-included-domains") || fathomScript.getAttribute("included-domains")) {
        allowedDomains = (fathomScript.getAttribute("data-included-domains") || fathomScript.getAttribute("included-domains")).split(",");
    } else if (fathomScript.getAttribute("data-allowed-domains") || fathomScript.getAttribute("allowed-domains")) {
        allowedDomains = (fathomScript.getAttribute("data-allowed-domains") || fathomScript.getAttribute("allowed-domains")).split(",");
    }

    // Configuración para SPA (Single Page Application)
    function spaHistory() {
        if (typeof history !== "undefined") {
            var pushState = history.pushState;
            history.pushState = function () {
                var ret = pushState.apply(history, arguments);
                window.dispatchEvent(new Event("pushstate"));
                window.dispatchEvent(new Event("locationchangefathom"));
                return ret;
            };
            window.addEventListener("popstate", function () {
                window.dispatchEvent(new Event("locationchangefathom"));
            });
            window.addEventListener("locationchangefathom", trackPageview);
        }
    }

    function spaHash() {
        window.addEventListener("hashchange", trackPageview);
    }

    // Detecta y configura el tipo de SPA
    if (fathomScript.getAttribute("data-spa") || fathomScript.getAttribute("spa")) {
        switch (fathomScript.getAttribute("data-spa") || fathomScript.getAttribute("spa")) {
            case "history":
                spaHistory();
                break;
            case "hash":
                spaHash();
                break;
            case "auto":
                (typeof history !== "undefined" ? spaHistory : spaHash)();
                break;
        }
    }

    var scriptUrl,
        trackerUrl = "https://cdn.usefathom.com/";

    // Codifica los parámetros
    function encodeParameters(params) {
        params.cid = Math.floor(1e8 * Math.random()) + 1;
        return "?" + Object.keys(params).map(function (k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
        }).join("&");
    }

    // Obtiene los parámetros de la URL
    function qs() {
        var pair, data = {}, pairs = window.location.search.substring(window.location.search.indexOf("?") + 1).split("&");
        for (var i = 0; i < pairs.length; i++) {
            if (pairs[i]) {
                pair = pairs[i].split("=");
                if (["keyword", "q", "ref", "s", "utm_campaign", "utm_content", "utm_medium", "utm_source", "utm_term", "action", "name", "pagename", "tab", "via"].indexOf(decodeURIComponent(pair[0])) > -1) {
                    data[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
                }
            }
        }
        return data;
    }

    // Verifica si el rastreo está habilitado
    function trackingEnabled() {
        var fathomIsBlocked = false;
        try {
            fathomIsBlocked = window.localStorage && window.localStorage.getItem("blockFathomTracking");
        } catch (err) { }
        var prerender = "visibilityState" in document && document.visibilityState === "prerender",
            isExcludedDomain = excludedDomains.indexOf(window.location.hostname) > -1,
            isAllowedDomain = allowedDomains.length === 0 || allowedDomains.indexOf(window.location.hostname) > -1;

        return !fathomIsBlocked && !prerender && !honorDNT && !isExcludedDomain && isAllowedDomain;
    }

    // Obtiene la ubicación actual
    function getLocation(params) {
        var a, location = window.location;
        if (typeof params.url === "undefined") {
            if (canonical && document.querySelector('link[rel="canonical"][href]')) {
                a = document.createElement("a");
                a.href = document.querySelector('link[rel="canonical"][href]').href;
                location = a;
            }
        } else {
            a = document.createElement("a");
            a.href = params.url;
            location = a;
        }
        return location;
    }

    // Configura el URL del script si no es el estándar
    if (fathomScript.src.indexOf("cdn.usefathom.com") < 0) {
        scriptUrl = document.createElement("a");
        scriptUrl.href = fathomScript.src;
        trackerUrl = "https://" + scriptUrl.hostname + "/";
    }

    // Inicia el rastreo automático si está habilitado
    if (auto) {
        setTimeout(function () {
            window.fathom.trackPageview();
        });
    }

    return {
        siteId: siteId,
        send: function (params) {
            if (trackingEnabled()) {
                var img = document.createElement("img");
                img.setAttribute("alt", "");
                img.setAttribute("aria-hidden", "true");
                img.style.position = "absolute";
                img.src = trackerUrl + encodeParameters(params);
                img.addEventListener("load", function () {
                    img.parentNode.removeChild(img);
                });
                img.addEventListener("error", function () {
                    img.parentNode.removeChild(img);
                });
                document.body.appendChild(img);
            }
        },
        beacon: function (params) {
            if (trackingEnabled()) {
                navigator.sendBeacon(trackerUrl + encodeParameters(params));
            }
        },
        trackPageview: function (params) {
            params = params || {};
            var location = getLocation(params);
            if (location.host !== "") {
                var hostname = location.protocol + "//" + location.hostname,
                    pathnameToSend = location.pathname || "/";
                if (fathomScript.getAttribute("data-spa") === "hash") {
                    pathnameToSend += location.hash;
                }
                this.send({
                    h: hostname,
                    p: pathnameToSend,
                    r: params.referrer || (document.referrer.indexOf(hostname) < 0 ? document.referrer : ""),
                    sid: this.siteId,
                    qs: JSON.stringify(qs())
                });
            }
        },
        trackGoal: function (code, cents) {
            var location = getLocation({}),
                hostname = location.protocol + "//" + location.hostname;
            this.beacon({
                gcode: code,
                gval: cents,
                qs: JSON.stringify(qs()),
                p: location.pathname || "/",
                h: hostname,
                r: document.referrer.indexOf(hostname) < 0 ? document.referrer : "",
                sid: this.siteId
            });
        },
        trackEvent: function (name, payload = {}) {
            var location = getLocation({}),
                hostname = location.protocol + "//" + location.hostname;
            this.beacon({
                name: name,
                payload: JSON.stringify(payload),
                p: location.pathname || "/",
                h: hostname,
                r: document.referrer.indexOf(hostname) < 0 ? document.referrer : "",
                sid: this.siteId,
                qs: JSON.stringify(qs())
            });
        },
        setSite: function (siteId) {
            this.siteId = siteId;
        },
        blockTrackingForMe: function () {
            if (window.localStorage) {
                window.localStorage.setItem("blockFathomTracking", true);
                alert("You have blocked Fathom for yourself on this website.");
            } else {
                alert("Your browser doesn't support localStorage.");
            }
        },
        enableTrackingForMe: function () {
            if (window.localStorage) {
                window.localStorage.removeItem("blockFathomTracking");
                alert("Fathom has been enabled for this website.");
            }
        },
        isTrackingEnabled: function () {
            return trackingEnabled() === true;
        }
    };
})();