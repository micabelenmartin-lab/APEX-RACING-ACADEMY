/* ═══════════════════════════════════════════
   APEX SIM RACING — main.js
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR ── */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function loopRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loopRing);
  })();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    ring.style.opacity   = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    ring.style.opacity   = '1';
  });

  /* ── HAMBURGER MENU ── */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── TELEMETRY LIVE VALUES ── */
  const rpmEl   = document.getElementById('tel-rpm');
  const speedEl = document.getElementById('hero-speed');

  const flicker = (el, min, max, suffix, interval) => {
    if (!el) return;
    const update = () => {
      const v = min + Math.floor(Math.random() * (max - min));
      el.textContent = v.toLocaleString() + suffix;
      setTimeout(update, interval + Math.random() * interval * .8);
    };
    update();
  };

  flicker(rpmEl,   9800, 11200, '', 350);
  flicker(speedEl, 248,  298,  ' km/h', 550);

  /* ── MORPHING TEXT IN HERO ── */
  const morphWords = ['GANAR', 'COMPETIR', 'DOMINAR', 'VENCER'];
  const morphEl = document.querySelector('.hl-green');
  let morphIdx = 0;

  if (morphEl) {
    setInterval(() => {
      morphIdx = (morphIdx + 1) % morphWords.length;
      morphEl.style.opacity = '0';
      morphEl.style.transform = 'translateY(-8px)';
      morphEl.style.transition = 'opacity .25s ease, transform .25s ease';
      setTimeout(() => {
        morphEl.textContent = morphWords[morphIdx];
        morphEl.style.opacity = '1';
        morphEl.style.transform = 'translateY(0)';
      }, 280);
    }, 3200);
  }

  /* ── SCROLL REVEAL ── */
  const revEls = document.querySelectorAll('.reveal,.reveal-l,.reveal-r');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  revEls.forEach(el => io.observe(el));

  /* ── PARALLAX HERO HEADLINE ── */
  const headline = document.querySelector('.hero-headline');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (headline) headline.style.transform = `translateY(${sy * .18}px)`;
  }, { passive: true });

  /* ── NAV ACTIVE LINK ── */
  const secs  = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  const navIo = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.style.color = '');
        const match = [...links].find(l => l.getAttribute('href') === '#' + e.target.id);
        if (match) match.style.color = 'var(--white)';
      }
    });
  }, { threshold: .4 });
  secs.forEach(s => navIo.observe(s));

  /* ── CIRCUIT HOVER DIMMING ── */
  const circuits = document.querySelectorAll('.exp-circuit');
  circuits.forEach(c => {
    c.addEventListener('mouseenter', () => {
      circuits.forEach(x => { if (x !== c) x.style.opacity = '.4'; });
    });
    c.addEventListener('mouseleave', () => {
      circuits.forEach(x => x.style.opacity = '1');
    });
  });

  /* ── PROG CARD MAGNETIC TILT ── */
  document.querySelectorAll('.prog-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) / (r.width  / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      card.style.transform = `perspective(600px) rotateY(${dx * 4}deg) rotateX(${-dy * 3}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform .5s ease';
    });
  });

  /* ── SCROLL PROGRESS BAR ── */
  const bar = document.getElementById('scroll-bar');
  if (bar) {
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ── GLITCH NAV LOGO ON HOVER ── */
  const logo = document.querySelector('.nav-logo');
  if (logo) {
    logo.addEventListener('mouseenter', () => {
      logo.style.animation = 'logoGlitch .4s steps(2) 1';
      logo.addEventListener('animationend', () => logo.style.animation = '', { once: true });
    });
  }

  /* ── TECH ITEM SCAN LINE ON HOVER ── */
  document.querySelectorAll('.tech-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.boxShadow = 'inset 0 0 0 1px rgba(0,255,136,.06)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.boxShadow = '';
    });
  });

  /* ── CTA TITLE CHAR SCRAMBLE ── */
  function scramble(el, finalText, duration = 800) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    const len = finalText.length;
    let frame = 0;
    const totalFrames = Math.ceil(duration / 32);

    const interval = setInterval(() => {
      let out = '';
      for (let i = 0; i < len; i++) {
        if (frame / totalFrames > i / len) {
          out += finalText[i];
        } else {
          out += finalText[i] === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
        }
      }
      el.textContent = out;
      frame++;
      if (frame >= totalFrames) {
        el.textContent = finalText;
        clearInterval(interval);
      }
    }, 32);
  }

  const ctaTitle = document.querySelector('.cta-main-text');
  if (ctaTitle) {
    let triggered = false;
    const ctaIo = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !triggered) {
        triggered = true;
        scramble(ctaTitle, 'EL TIEMPO', 900);
      }
    }, { threshold: .5 });
    ctaIo.observe(ctaTitle);
  }

  /* ══════════════════════════════
     CARRUSEL GENÉRICO
  ══════════════════════════════ */
  function initCarousel(track, dotsContainer) {
    if (!track) return;

    const items = Array.from(track.children);
    let current = 0, startX = 0, isDragging = false, dragOffset = 0;

    if (dotsContainer) {
      items.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Ir al slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      });
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, items.length - 1));
      track.style.transition = 'transform .4s cubic-bezier(.25,.8,.25,1)';
      track.style.transform  = `translateX(calc(-${current * 100}% - ${current}px))`;
      updateDots();
    }

    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX; isDragging = true;
      track.style.transition = 'none';
    }, { passive: true });

    track.addEventListener('touchmove', e => {
      if (!isDragging) return;
      dragOffset = e.touches[0].clientX - startX;
      track.style.transform = `translateX(calc(-${current * 100}% - ${current}px + ${dragOffset}px))`;
    }, { passive: true });

    track.addEventListener('touchend', () => {
      isDragging = false;
      if      (dragOffset < -50) goTo(current + 1);
      else if (dragOffset >  50) goTo(current - 1);
      else                       goTo(current);
      dragOffset = 0;
    });

    track.addEventListener('mousedown', e => {
      startX = e.clientX; isDragging = true;
      track.style.transition = 'none'; track.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      dragOffset = e.clientX - startX;
      track.style.transform = `translateX(calc(-${current * 100}% - ${current}px + ${dragOffset}px))`;
    });
    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false; track.style.cursor = '';
      if      (dragOffset < -50) goTo(current + 1);
      else if (dragOffset >  50) goTo(current - 1);
      else                       goTo(current);
      dragOffset = 0;
    });
  }

  function setupCarousels() {
    const isMobile  = window.innerWidth <= 768;
    const expTrack  = document.querySelector('.exp-circuits');
    const expDots   = document.querySelector('.exp-carousel-dots');
    const progTrack = document.querySelector('.prog-cards');
    const progDots  = document.querySelector('.prog-carousel-dots');

    if (isMobile) {
      expTrack  && expTrack.classList.add('carousel-track');
      progTrack && progTrack.classList.add('carousel-track');
      initCarousel(expTrack,  expDots);
      initCarousel(progTrack, progDots);
    } else {
      expTrack  && expTrack.classList.remove('carousel-track');
      progTrack && progTrack.classList.remove('carousel-track');
      [expTrack, progTrack].forEach(t => { if (t) { t.style.transform = ''; t.style.transition = ''; } });
      [expDots,  progDots ].forEach(d => { if (d) d.innerHTML = ''; });
    }
  }

  setupCarousels();
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(setupCarousels, 200); });

  /* ══════════════════════════════
     SIMULADOR — GOTA DE AGUA
     Forma: blob multi-lóbulo que late y se deforma como mercurio/agua.
     Tamaño: ~65px de radio base (mitad del anterior de 130px).
     Movimiento: lag suave (lerp 0.04) + oscilación independiente por punto.
  ══════════════════════════════ */
  (function () {
    const wrap      = document.getElementById('sim-wrap');
    if (!wrap) return;
    const lensInner = document.getElementById('sim-lens-inner');
    if (!lensInner) return;

    /* ── Parámetros de la gota ── */
    const N        = 20;        // puntos del polígono → contorno muy suave
    const BASE_R   = 65;        // radio base en px  (mitad de 130)
    const NOISE_A  = 22;        // amplitud de deformación — pequeña para que no pierda forma de gota
    const SPEED    = 0.00028;   // velocidad de animación — lenta, "líquida"
    /* Tensión superficial: qué tan rápido el blob
       "atrapa" al cursor. Valor bajo = rezaga mucho = efecto mercurio */
    const LERP_FOLLOW = 0.038;

    /* Semillas únicas por punto */
    const seeds = Array.from({ length: N }, () => Math.random() * 1000);

    /* Estado */
    let targetX = 0, targetY = 0, cx = 0, cy = 0, rafId = null;

    function lerp(a, b, t) { return a + (b - a) * t; }

    /*
      Ruido de gota de agua:
      - Frecuencia baja dominante  → forma redondeada estable
      - Frecuencia media           → ondulación suave en el borde
      - Frecuencia alta muy tenue  → micro-vibraciones de tensión superficial
      - Pulso global (sin seed)    → "respira" como una gota viva
    */
    function dropNoise(t, seed) {
      const pulse = Math.sin(t * 0.9) * 0.08;          // respiración global
      return (
        Math.sin(t * 0.7  + seed)        * 0.45 +      // onda base lenta
        Math.sin(t * 1.8  + seed * 1.4)  * 0.28 +      // ondulación media
        Math.sin(t * 3.2  + seed * 2.2)  * 0.14 +      // detalle fino
        Math.sin(t * 5.5  + seed * 3.1)  * 0.05 +      // micro-vibración
        pulse
      );
    }

    function buildClipPath(x, y, t) {
      const W   = wrap.offsetWidth;
      const H   = wrap.offsetHeight;
      const pts = [];

      for (let i = 0; i < N; i++) {
        /* Distribuir ángulos con leve perturbación → evita simetría perfecta */
        const baseAngle = (i / N) * Math.PI * 2 - Math.PI / 2;
        const angleJitter = dropNoise(t * 0.3, seeds[i] + 500) * 0.08; // jitter angular sutil
        const angle = baseAngle + angleJitter;

        const r  = BASE_R + dropNoise(t, seeds[i]) * NOISE_A;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        pts.push(`${(px / W * 100).toFixed(3)}% ${(py / H * 100).toFixed(3)}%`);
      }
      return `polygon(${pts.join(', ')})`;
    }

    function loop(ts) {
      const t = ts * SPEED;
      cx = lerp(cx, targetX, LERP_FOLLOW);
      cy = lerp(cy, targetY, LERP_FOLLOW);
      lensInner.style.clipPath = buildClipPath(cx, cy, t);
      rafId = requestAnimationFrame(loop);
    }

    wrap.addEventListener('mouseenter', e => {
      const rect = wrap.getBoundingClientRect();
      targetX = cx = e.clientX - rect.left;
      targetY = cy = e.clientY - rect.top;
      rafId = requestAnimationFrame(loop);
    });

    wrap.addEventListener('mouseleave', () => {
      cancelAnimationFrame(rafId);
    });

    wrap.addEventListener('mousemove', e => {
      const rect = wrap.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    });

  })();

});
