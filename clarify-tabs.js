/* Clarify — section visuals · WIRING (all motion is CSS)
   Hosted: https://cdn.jsdelivr.net/gh/Ish-Development/clarify-ui-animations@3/clarify-tabs.min.js
   Link it in Webflow: Site settings → Custom code → Footer (before </body>).
   1. Count-up: reads each .cv_count's typed number into --to (and data-cv-from into --from; 1–2 decimals OK),
      then flags the page .is-cv-ready.
   2. Play:
      · [data-cv="tabs"] (desktop/tablet): visuals wait until the wrapper scrolls into view; after that
        your tab script's .is-active drives them.
      · Stacked (wrapper ≤ 48em wide, like threshold-medium — change with data-cv-stack="991" (px) on the
        wrapper): there are no tabs; every visual plays once, on its own, when it scrolls into view.
      · [data-cv="group"] (not tabs, e.g. "Built to extend"): all visuals play together, once, when the
        section scrolls into view; stacked, each plays on its own as it comes into view.
   Fitting each visual to its panel is pure CSS (container query units in clarify-tabs.css), not this script.
   Without this script everything still renders and fits — just without count-up and scroll trigger. */
(function () {
  function cvInit(scope) {
    scope = scope || document;
    scope.querySelectorAll(".cv_count").forEach(function (el) {
      var n = parseInt(el.textContent.replace(/\D/g, ""), 10);
      if (!isNaN(n)) el.style.setProperty("--to", n);
      var dp = (el.textContent.match(/\.(\d+)/) || ["", ""])[1].length;   // 7.6 → counts 0…76 in tenths
      if (dp === 1 || dp === 2) el.classList.add("is-dec" + dp);
      if (el.dataset.cvFrom) el.style.setProperty("--from", parseInt(el.dataset.cvFrom, 10));   // optional start value
    });
    document.documentElement.classList.add("is-cv-ready");
  }
  window.cvInit = cvInit;
  window.cvFit = function () {};                        // fitting is CSS now; kept so older wiring doesn't break

  // stacked = the wrapper is narrow (its own width, like a container query), unless told otherwise
  function isStacked(root) {
    if (root.dataset.cvLayout) return root.dataset.cvLayout === "stacked";   // explicit override
    var rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    var limit = root.dataset.cvStack ? parseFloat(root.dataset.cvStack) : 48 * rem;   // 48em = threshold-medium
    return root.getBoundingClientRect().width <= limit;
  }

  // Stacked: each frame is armed (animations parked on their first frame) and plays once in view
  function armStacked(root) {
    root.classList.remove("is-cv-paused");
    root.classList.add("is-cv-stacked");
    root.querySelectorAll(".cv_component").forEach(function (frame) {
      frame.classList.add("is-active", "is-cv-paused");
      if (!("IntersectionObserver" in window)) { frame.classList.remove("is-cv-paused"); return; }
      new IntersectionObserver(function (entries, io) {
        if (!entries[0].isIntersecting) return;
        frame.classList.remove("is-cv-paused");
        io.disconnect();
      }, { threshold: 0.35 }).observe(frame);
    });
  }
  window.cvArmStacked = armStacked;

  // Group: every visual is armed and they all start together once the section is in view
  function armGroup(root) {
    var frames = root.querySelectorAll(".cv_component");
    frames.forEach(function (f) { f.classList.add("is-active", "is-cv-paused"); });
    var go = function () { frames.forEach(function (f) { f.classList.remove("is-cv-paused"); }); root.classList.add("is-cv-played"); };
    if (!("IntersectionObserver" in window)) return go();
    new IntersectionObserver(function (entries, io) {
      if (!entries[0].isIntersecting) return;
      go(); io.disconnect();
    }, { threshold: 0.3 }).observe(root);
  }
  window.cvArmGroup = armGroup;

  // Tabs: the whole wrapper waits until it's in view, then the tab script takes over
  function armTabs(root) {
    if (!("IntersectionObserver" in window)) return;
    root.classList.add("is-cv-paused");
    new IntersectionObserver(function (entries, io) {
      if (!entries[0].isIntersecting) return;
      root.classList.remove("is-cv-paused");
      root.dispatchEvent(new CustomEvent("cv:visible"));   // start your autoplay from here if you like
      io.disconnect();
    }, { threshold: 0.25 }).observe(root);
  }

  function start() {
    cvInit(document);
    document.querySelectorAll('[data-cv="tabs"], [data-cv="group"]').forEach(function (root) {
      if (root.dataset.cvInitialized) return;           // own flag: other scripts may set data-script-initialized here
      root.dataset.cvInitialized = "true";
      if (isStacked(root)) armStacked(root);
      else if (root.dataset.cv === "group") armGroup(root);
      else armTabs(root);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
