/* THE 鍼灸 育毛鍼灸LP — Vanilla JS（ライブラリなし） */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. LINEリンクを全ボタンに反映 */
  var LINE_URL = window.LINE_URL || "https://line.me/R/ti/p/@REPLACE_ME";
  document.querySelectorAll(".js-line").forEach(function (a) {
    a.href = LINE_URL;
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* 2. FAQ（開閉） */
  document.querySelectorAll(".qa button").forEach(function (b) {
    b.addEventListener("click", function () {
      var qa = b.parentElement;
      var open = qa.classList.toggle("open");
      b.setAttribute("aria-expanded", open);
    });
  });

  /* 3. 数字カウントアップ（2,000 / 4,980） */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (!target || reduce) return;
    var start = null, dur = 1400;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("ja-JP");
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = "0";
    requestAnimationFrame(step);
  }

  /* 4. 出現アニメーション
        画面に入った要素を、上から順に 90ms ずつ遅らせて表示する（「次が出てくる」間）。 */
  var targets = [].slice.call(document.querySelectorAll(".rv"));
  if (!("IntersectionObserver" in window)) {
    document.documentElement.classList.add("js-off");
  } else {
    var queue = [], timer = null;

    function flush() {
      timer = null;
      queue.sort(function (a, b) {
        return a.getBoundingClientRect().top - b.getBoundingClientRect().top ||
               a.getBoundingClientRect().left - b.getBoundingClientRect().left;
      });
      queue.forEach(function (el, i) {
        el.style.transitionDelay = (reduce ? 0 : Math.min(i * 90, 450)) + "ms";
        el.classList.add("in");
        el.querySelectorAll("[data-count]").forEach(countUp);
      });
      queue = [];
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          queue.push(e.target);
          io.unobserve(e.target);
        }
      });
      if (queue.length && !timer) timer = setTimeout(flush, 30);
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* 5. 下固定CTA（FVを過ぎたら表示） */
  var fv = document.getElementById("fv");
  var sticky = document.getElementById("sticky");
  if (fv && sticky) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        sticky.classList.toggle("show", window.scrollY > fv.offsetHeight * 0.7);
        ticking = false;
      });
    }, { passive: true });
  }
})();
