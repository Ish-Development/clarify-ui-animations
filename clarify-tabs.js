/* Clarify — tab visuals · WIRING (all motion is CSS)
   Hosted: https://cdn.jsdelivr.net/gh/Ish-Development/clarify-ui-animations@1/clarify-tabs.min.js
   Link it in Webflow: Site settings → Custom code → Footer (before </body>).
   1. Count-up: reads each .cv-count's typed number into --to (and data-from into --from; 1–2 decimals OK),
      then flags the page .cv-ready.
   2. Fit: each visual sits in a .cv-frame that fills its panel; when the frame is smaller than the
      visual the whole visual shrinks proportionally to fit it — everything stays, like a scaled
      image. Never enlarges.
   3. Play:
      · Tabs (desktop/tablet): visuals wait until the tab component scrolls into view; after that
        your tab script's .is-active drives them.
      · Stacked (phones, ≤ 767px by default — change with data-cv-stack="991" on the [data-tabs]
        root): there are no tabs; every visual plays once, on its own, when it scrolls into view.
        No loop, no autoplay.
      · In-view sections (not tabs, e.g. "Built to extend": [data-cv-inview] on the section root):
        all visuals play together, once, when the section scrolls into view (their own delays set
        the order); on phones each plays on its own as it comes into view.
   Without this script everything still renders — just without count-up, fit and scroll trigger. */
(function () {
  var fitters = typeof ResizeObserver !== "undefined" ? new ResizeObserver(function (entries) {
    entries.forEach(function (e) { fit(e.target); });
  }) : null;

  // scale the .cv inside `box` so it fits the box (width, and height when the box is a .cv-frame)
  function fit(box) {
    var cv = box.querySelector(":scope > .cv");
    if (!cv) return;
    var cs = getComputedStyle(box);
    var aw = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var ah = box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (aw <= 0) return;                                  // hidden panel
    var key = aw + "x" + ah;
    if (key === box._cvK) return;                         // nothing changed
    box._cvK = key;
    cv.style.zoom = "";
    var s = Math.min(1, aw / cv.offsetWidth);
    if (box.classList.contains("cv-frame") && ah > 0) s = Math.min(s, ah / cv.offsetHeight);   // fit the panel's height too
    s = Math.floor(s * 1000) / 1000;                     // round down so it never pokes out
    if (s < 1) cv.style.zoom = s;
  }

  function cvInit(scope) {
    scope = scope || document;
    scope.querySelectorAll(".cv-count").forEach(function (el) {
      var n = parseInt(el.textContent.replace(/\D/g, ""), 10);
      if (!isNaN(n)) el.style.setProperty("--to", n);
      var dp = (el.textContent.match(/\.(\d+)/) || ["", ""])[1].length;   // 7.6 → counts 0…76 in tenths
      if (dp === 1 || dp === 2) el.classList.add("cv-dec" + dp);
      if (el.dataset.from) el.style.setProperty("--from", parseInt(el.dataset.from, 10));   // optional start value
    });
    scope.querySelectorAll(".cv").forEach(function (cv) {
      var box = cv.parentElement;
      box._cvK = "";
      if (fitters) fitters.observe(box);                 // refits on resize and when a tab is shown
      fit(box);
    });
    document.documentElement.classList.add("cv-ready");
  }
  window.cvInit = cvInit;
  // call after showing a panel yourself if you want the fit applied before the first frame
  window.cvFit = function (scope) {
    (scope || document).querySelectorAll(".cv").forEach(function (cv) { cv.parentElement._cvK = ""; fit(cv.parentElement); });
  };

  function isStacked(root) {
    if (root.dataset.cvLayout) return root.dataset.cvLayout === "stacked";   // explicit override
    return window.matchMedia("(max-width: " + (root.dataset.cvStack || 767) + "px)").matches;
  }

  // Stacked: each frame is armed (animations parked on their first frame) and plays once in view
  function armStacked(root) {
    root.classList.remove("cv-paused");
    root.classList.add("cv-stacked");
    root.querySelectorAll(".cv-frame").forEach(function (frame) {
      frame.classList.add("is-active", "cv-paused");
      if (!("IntersectionObserver" in window)) { frame.classList.remove("cv-paused"); return; }
      new IntersectionObserver(function (entries, io) {
        if (!entries[0].isIntersecting) return;
        frame.classList.remove("cv-paused");
        io.disconnect();
      }, { threshold: 0.35 }).observe(frame);
    });
  }
  window.cvArmStacked = armStacked;

  // In-view section: every visual is armed and they all start together once the section is in view
  function armGroup(root) {
    var frames = root.querySelectorAll(".cv-frame");
    frames.forEach(function (f) { f.classList.add("is-active", "cv-paused"); });
    var go = function () { frames.forEach(function (f) { f.classList.remove("cv-paused"); }); root.classList.add("cv-played"); };
    if (!("IntersectionObserver" in window)) return go();
    new IntersectionObserver(function (entries, io) {
      if (!entries[0].isIntersecting) return;
      go(); io.disconnect();
    }, { threshold: 0.3 }).observe(root);
  }
  window.cvArmGroup = armGroup;

  // Tabs: the whole component waits until it's in view, then the tab script takes over
  function armTabs(root) {
    if (!("IntersectionObserver" in window)) return;
    root.classList.add("cv-paused");
    new IntersectionObserver(function (entries, io) {
      if (!entries[0].isIntersecting) return;
      root.classList.remove("cv-paused");
      root.dispatchEvent(new CustomEvent("cv:visible"));   // start autoplay from here
      io.disconnect();
    }, { threshold: 0.25 }).observe(root);
  }

  function start() {
    cvInit(document);
    document.querySelectorAll("[data-tabs]").forEach(function (root) {
      if (isStacked(root)) armStacked(root); else armTabs(root);
    });
    document.querySelectorAll("[data-cv-inview]").forEach(function (root) {
      if (isStacked(root)) armStacked(root); else armGroup(root);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
