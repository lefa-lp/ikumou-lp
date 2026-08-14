/* =========================================================
   育毛鍼灸LP - Vanilla JavaScript
   外部ライブラリなし。将来のGA/Meta Pixel連携を想定した構造。
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------
     LINE URL（サーバー側のSITE_CONFIGから注入される）
     全CTAボタンは href に直接LINE_URLを埋め込み済みだが、
     JS側からも参照できるよう定数として保持しておく。
  --------------------------------------------------- */
  var LINE_URL = (window.SITE_CONFIG && window.SITE_CONFIG.LINE_URL) || "https://line.me/XXXXXXXX";

  /* ---------------------------------------------------
     1. FAQアコーディオン
  --------------------------------------------------- */
  function initFaqAccordion() {
    var questions = document.querySelectorAll(".faq-question");

    questions.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        var answerId = btn.getAttribute("aria-controls");
        var answer = document.getElementById(answerId);

        btn.setAttribute("aria-expanded", String(!expanded));

        if (answer) {
          answer.hidden = expanded; // 開いていたら閉じる、閉じていたら開く
        }
      });

      // キーボード操作（Enter/Spaceはbutton要素のデフォルト動作で対応可能）
    });
  }

  /* ---------------------------------------------------
     2. お客様の声スライダー（横スワイプ / ドラッグ対応）
  --------------------------------------------------- */
  function initVoiceSlider() {
    var slider = document.getElementById("voiceSlider");
    if (!slider) return;

    var isDown = false;
    var startX = 0;
    var scrollLeftStart = 0;

    slider.addEventListener("pointerdown", function (e) {
      isDown = true;
      startX = e.clientX;
      scrollLeftStart = slider.scrollLeft;
      slider.setPointerCapture(e.pointerId);
    });

    slider.addEventListener("pointermove", function (e) {
      if (!isDown) return;
      var dx = e.clientX - startX;
      slider.scrollLeft = scrollLeftStart - dx;
    });

    ["pointerup", "pointercancel", "pointerleave"].forEach(function (evt) {
      slider.addEventListener(evt, function () {
        isDown = false;
      });
    });

    // タッチデバイスはネイティブのスクロール(overflow-x + scroll-snap)で
    // スワイプできるため、pointer系は主にマウス操作の補助として機能する。
  }

  /* ---------------------------------------------------
     3. 固定LINEボタン（一定スクロール後にフェードイン）
  --------------------------------------------------- */
  function initFixedCta() {
    var fixedCta = document.getElementById("fixedCta");
    if (!fixedCta) return;

    var hero = document.getElementById("hero");
    var threshold = hero ? hero.offsetHeight * 0.6 : 400;
    var ticking = false;

    function update() {
      var scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > threshold) {
        fixedCta.classList.add("is-visible");
      } else {
        fixedCta.classList.remove("is-visible");
      }
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    });

    update();
  }

  /* ---------------------------------------------------
     4. スムーススクロール（ページ内リンク）
  --------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var targetId = link.getAttribute("href");
        if (!targetId || targetId === "#") return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* ---------------------------------------------------
     5. CTAクリック計測
     data-cta-location属性を持つ全ボタンのクリックをログ出力。
     将来的にGoogle Analytics / Meta Pixelへ接続する際は、
     このハンドラ内でgtag()やfbq()を呼び出す想定。
  --------------------------------------------------- */
  function initCtaTracking() {
    document.querySelectorAll("[data-cta-location]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var location = btn.getAttribute("data-cta-location");
        console.log("CTA clicked:", location);

        // 将来的な拡張例:
        // if (typeof gtag === "function") {
        //   gtag("event", "cta_click", { cta_location: location });
        // }
        // if (typeof fbq === "function") {
        //   fbq("trackCustom", "CTAClick", { location: location });
        // }
      });
    });
  }

  /* ---------------------------------------------------
     6. スクロールフェードイン（IntersectionObserver）
  --------------------------------------------------- */
  function initFadeIn() {
    var targets = document.querySelectorAll(
      ".section-title, .section-title-lg, .worry-card, .case-card, " +
      ".compare-card, .reason-item, .flow-step, .faq-item, .diagram"
    );

    targets.forEach(function (el) {
      el.classList.add("fade-in");
    });

    if (!("IntersectionObserver" in window)) {
      // 非対応環境ではすべて表示状態にする
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------
     初期化
  --------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    initFaqAccordion();
    initVoiceSlider();
    initFixedCta();
    initSmoothScroll();
    initCtaTracking();
    initFadeIn();
  });
})();
