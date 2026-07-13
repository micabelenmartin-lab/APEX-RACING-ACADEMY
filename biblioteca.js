/* ═══════════════════════════════════════════
   APEX SIM RACING — biblioteca.js
   Lógica de la página Biblioteca de Diseño
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── LOADER ── */
  (function () {
    var loader = document.getElementById('loader');
    var bar = document.querySelector('.loader-bar');
    if (!loader) return;

    var progress = 0;
    var interval = setInterval(function () {
      progress += Math.random() * 22 + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (bar) bar.style.width = '100%';
        setTimeout(function () {
          loader.classList.add('loader-out');
          setTimeout(function () {
            loader.style.display = 'none';
            document.body.classList.remove('no-scroll');
          }, 700);
        }, 250);
      } else if (bar) {
        bar.style.width = progress + '%';
      }
    }, 100);
  })();

  /* ── CUSTOM CURSOR ── */
  var cursor = document.getElementById('cursor');
  var ring = document.getElementById('cursor-ring');
  if (cursor && ring) {
    var mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });
    (function loopRing() {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(loopRing);
    })();
    document.addEventListener('mouseleave', function () {
      cursor.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      cursor.style.opacity = '1';
      ring.style.opacity = '1';
    });
  }

  /* ── HAMBURGER MENU ── */
  var navToggle = document.getElementById('bib-nav-toggle');
  var navLinks = document.getElementById('bib-nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── COPIAR HEX AL HACER CLIC EN SWATCH ── */
  document.querySelectorAll('.bib-swatch').forEach(function (swatch) {
    swatch.addEventListener('click', function () {
      var hex = swatch.getAttribute('data-hex');
      if (!hex) return;

      var copy = function () {
        swatch.classList.remove('bib-copied');
        void swatch.offsetWidth; /* reinicia la animación si se hace clic varias veces */
        swatch.classList.add('bib-copied');
        setTimeout(function () { swatch.classList.remove('bib-copied'); }, 1100);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(hex).then(copy).catch(copy);
      } else {
        copy();
      }
    });
  });

  /* ── TARJETA CON FLIP ── */
  var flipDemo = document.getElementById('bib-flip-demo');
  if (flipDemo) {
    var toggleFlip = function () { flipDemo.classList.toggle('bib-flipped'); };
    flipDemo.addEventListener('click', toggleFlip);
    flipDemo.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFlip();
      }
    });
  }

  /* ── TABS ── */
  var tabsWrap = document.getElementById('bib-tabs');
  if (tabsWrap) {
    var tabBtns = tabsWrap.querySelectorAll('.bib-tab-btn');
    var tabPanels = tabsWrap.querySelectorAll('.bib-tab-panel');
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab');
        tabBtns.forEach(function (b) { b.classList.remove('bib-tab-active'); });
        tabPanels.forEach(function (p) { p.classList.remove('bib-tab-panel-active'); });
        btn.classList.add('bib-tab-active');
        var panel = tabsWrap.querySelector('.bib-tab-panel[data-panel="' + target + '"]');
        if (panel) panel.classList.add('bib-tab-panel-active');
      });
    });
  }

  /* ── ACORDEÓN ── */
  var accordion = document.getElementById('bib-accordion');
  if (accordion) {
    var accItems = accordion.querySelectorAll('.bib-acc-item');
    accItems.forEach(function (item) {
      var trigger = item.querySelector('.bib-acc-trigger');
      if (!trigger) return;
      trigger.addEventListener('click', function () {
        var wasOpen = item.classList.contains('bib-acc-open');
        accItems.forEach(function (i) { i.classList.remove('bib-acc-open'); });
        if (!wasOpen) item.classList.add('bib-acc-open');
      });
    });
  }

  /* ── REVEAL AL SCROLL ── */
  var revEls = document.querySelectorAll('.reveal,.reveal-l,.reveal-r');
  if (revEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revEls.forEach(function (el) { io.observe(el); });
  }

  /* ── ANIMACIÓN DE TELEMETRÍA (barras + anillo) ── */
  var teleSection = document.getElementById('telemetria');
  if (teleSection) {
    var animated = false;
    var animateTelemetry = function () {
      if (animated) return;
      animated = true;

      teleSection.querySelectorAll('.bib-skill-fill').forEach(function (fill) {
        var target = fill.style.width;
        fill.style.width = '0%';
        requestAnimationFrame(function () {
          setTimeout(function () { fill.style.width = target; }, 50);
        });
      });

      var ringFill = teleSection.querySelector('.bib-ring-fill');
      var ringNum = teleSection.querySelector('.bib-ring-num');
      if (ringFill) {
        var circumference = 327;
        var value = ringNum ? parseFloat(ringNum.textContent) : 86;
        var offset = circumference - (value / 100) * circumference;
        ringFill.style.strokeDashoffset = circumference;
        requestAnimationFrame(function () {
          setTimeout(function () { ringFill.style.strokeDashoffset = offset; }, 50);
        });
      }
    };

    var teleIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateTelemetry();
          teleIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    teleIo.observe(teleSection);
  }

  /* ── NAV ACTIVA SEGÚN SECCIÓN VISIBLE ── */
  var sections = document.querySelectorAll('.bib-section[id]');
  var navAnchors = document.querySelectorAll('#bib-nav-links a[href^="#"]');
  if (sections.length && navAnchors.length) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.getAttribute('id');
        var link = document.querySelector('#bib-nav-links a[href="#' + id + '"]');
        if (!link) return;
        if (entry.isIntersecting) {
          navAnchors.forEach(function (a) { a.classList.remove('active'); });
          link.classList.add('active');
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(function (sec) { navIo.observe(sec); });
  }

});
