/* Clarify — big number roll (nv_*). Pairs with clarify-number.min.css.
   Hosted: https://cdn.jsdelivr.net/gh/Ish-Development/clarify-ui-animations@4/clarify-number.min.js

   Add data-nv="roll" to any text element that holds a number (e.g. <p class="scale1_cell_number …" data-nv="roll">
   10.000.000</p>). On load the script:
     1. builds the digits from its text (one 1em window per digit, the dots/commas/spaces as separators) and keeps the
        real number for screen readers;
     2. measures the number (--nv-fit) so the CSS can shrink it to fit a narrow box;
     3. plays the roll once, when the number scrolls into view (.is-active + .is-paused until then).
   Reduced motion: builds nothing, the plain number shows. API: window.ClarifyNumber.init(scope), .replay(el). */
(function () {
  "use strict";
  var SPINS = 4;                       // extra turns for the right-most digit; 0 for the left-most (count-up feel)

  function build(el) {
    if (el.getAttribute("data-nv-ready")) return;
    var text = el.textContent.trim();
    var total = text.replace(/\D/g, "").length;
    if (!total) return;
    el.setAttribute("data-nv-ready", "true");
    el.classList.add("nv_number");

    var sr = document.createElement("span");
    sr.className = "nv_number_sr";
    sr.textContent = text;
    var roll = document.createElement("span");
    roll.className = "nv_number_roll";
    roll.setAttribute("aria-hidden", "true");

    var i = 0;
    for (var c = 0; c < text.length; c++) {
      var ch = text.charAt(c);
      var span = document.createElement("span");
      if (ch >= "0" && ch <= "9") {
        var d = +ch;
        var turns = total > 1 ? Math.round((i * SPINS) / (total - 1)) : 1;
        if (!turns && !d) turns = 1;     // a leading 0 still rolls
        span.className = "nv_number_digit";
        span.style.setProperty("--nv-roll", d + 10 * turns);
        span.style.setProperty("--nv-i", i);
        i++;
      } else {
        span.className = "nv_number_sep";
        if (ch === " ") ch = " ";
      }
      span.textContent = ch;
      roll.appendChild(span);
    }
    el.textContent = "";
    el.appendChild(sr);
    el.appendChild(roll);
    fit(el);
  }

  // the number's width in em (any font, any tracking), so the CSS can fit it: min(1em, 100cqw / --nv-fit)
  function fit(el) {
    var roll = el.querySelector(".nv_number_roll");
    if (!roll) return;
    var fs = parseFloat(getComputedStyle(roll).fontSize);
    if (fs) el.style.setProperty("--nv-fit", ((roll.getBoundingClientRect().width / fs) * 1.01).toFixed(3));
  }

  function arm(el) {
    el.classList.add("is-active", "is-paused");
    if (!("IntersectionObserver" in window)) { el.classList.remove("is-paused"); return; }
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      el.classList.remove("is-paused");
      io.disconnect();
    }, { threshold: 0.4 });
    io.observe(el);
  }

  function init(scope) {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var els = (scope || document).querySelectorAll('[data-nv="roll"]');
    for (var k = 0; k < els.length; k++) {
      if (els[k].getAttribute("data-nv-ready")) continue;
      build(els[k]);
      if (els[k].getAttribute("data-nv-ready")) arm(els[k]);
    }
  }

  function replay(el) {
    el.classList.remove("is-active", "is-paused");
    void el.offsetWidth;
    el.classList.add("is-active");
  }

  // re-measure once the web font is in (the fallback font has other widths)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () {
    var els = document.querySelectorAll('[data-nv-ready]');
    for (var k = 0; k < els.length; k++) fit(els[k]);
  });

  window.ClarifyNumber = { init: init, replay: replay };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { init(); });
  else init();
})();
