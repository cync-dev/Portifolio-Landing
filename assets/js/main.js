(function () {
  "use strict";

  /* ---- mobile nav ---- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- chat demo: play messages one by one, with a typing bubble before each reply ---- */
  var phoneBody = document.querySelector(".phone-body");
  var phoneFrame = document.querySelector(".phone-frame");
  if (phoneBody && phoneFrame) {
    var bubbles = Array.prototype.slice.call(phoneBody.children);
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      // no animation: content is already visible in the markup
    } else {
      bubbles.forEach(function (b) { b.classList.add("is-hidden"); });

      var typingBubble = document.createElement("div");
      typingBubble.className = "bubble bubble-typing";
      typingBubble.setAttribute("aria-hidden", "true");
      typingBubble.innerHTML = "<span></span><span></span><span></span>";

      var played = false;
      var play = function () {
        if (played) return;
        played = true;

        var i = 0;
        var revealNext = function () {
          if (i >= bubbles.length) return;
          var bubble = bubbles[i];
          var isOut = bubble.classList.contains("bubble-out");
          var thinkTime = isOut ? 700 : 450;
          var typeTime = isOut ? 950 : 550;

          window.setTimeout(function () {
            typingBubble.classList.toggle("bubble-out", isOut);
            typingBubble.classList.toggle("bubble-in", !isOut);
            phoneBody.insertBefore(typingBubble, bubble);
            phoneBody.scrollTop = phoneBody.scrollHeight;

            window.setTimeout(function () {
              typingBubble.remove();
              bubble.classList.remove("is-hidden");
              phoneBody.scrollTop = phoneBody.scrollHeight;
              i++;
              revealNext();
            }, typeTime);
          }, thinkTime);
        };
        revealNext();
      };

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            play();
            observer.disconnect();
          }
        });
      }, { threshold: 0.5 });
      observer.observe(phoneFrame);
    }
  }
})();
