/* ═══════════════════════════════════════════
   APEX SIM RACING — main.js
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
/* ══════════════════════════════════════════════════════
     LÓGICA PÁGINA DETALLE (Agregar esto al inicio del JS)
  ══════════════════════════════════════════════════════ */
  if (window.location.pathname.includes('detalle.html')) {
    const params = new URLSearchParams(window.location.search);
    const tipo = params.get('prog');
    
    // Base de datos de información
    const info = {
        'entry': { titulo: 'PROGRAMA ENTRY', desc: 'Introducción técnica al sim racing con telemetría básica.' },
        'pro':   { titulo: 'PROGRAMA PRO', desc: '8 sesiones intensivas con análisis de datos y psicología de carrera.' },
        'elite': { titulo: 'PROGRAMA ELITE', desc: 'Entrenamiento total: Telemetría avanzada, coach personal y plan físico.' }
    };

    const tituloEl = document.getElementById('titulo-programa');
    const descEl = document.getElementById('contenido-programa');
    
    if (tituloEl && descEl && info[tipo]) {
        tituloEl.textContent = info[tipo].titulo;
        descEl.innerHTML = `<p>${info[tipo].desc}</p>`;
    }
    return; // Esto evita que el resto del JS (carruseles/animaciones) intente ejecutarse en detalle.html
  }
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
      morphEl.style.opacity   = '0';
      morphEl.style.transform = 'translateY(-8px)';
      morphEl.style.transition = 'opacity .25s ease, transform .25s ease';
      setTimeout(() => {
        morphEl.textContent      = morphWords[morphIdx];
        morphEl.style.opacity    = '1';
        morphEl.style.transform  = 'translateY(0)';
      }, 280);
    }, 3200);
  }

  /* ── PREFERENCIA DE MOVIMIENTO REDUCIDO ── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── PARTICLE CANVAS: líneas de velocidad en el hero ── */
  (function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles;

    function resize() {
      const hero = canvas.closest('#hero');
      w = canvas.width  = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }

    function makeParticle() {
      const cx = w * 0.72, cy = h * 0.5; // origen cerca del panel derecho (piloto)
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 1.6;
      return {
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 60 + Math.random() * 90,
        color: Math.random() > 0.6 ? '191,95,255' : '0,255,136'
      };
    }

    function initParticleField(count) {
      particles = [];
      for (let i = 0; i < count; i++) {
        const p = makeParticle();
        p.life = Math.random() * p.maxLife; // desfasadas para que no nazcan todas juntas
        particles.push(p);
      }
    }

    resize();
    initParticleField(46);
    window.addEventListener('resize', () => { resize(); });

    function tick() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 1.012;
        p.vy *= 1.012;
        p.life++;
        const fade = 1 - p.life / p.maxLife;
        if (fade <= 0 || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
          particles[i] = makeParticle();
          return;
        }
        ctx.strokeStyle = `rgba(${p.color},${Math.max(fade * 0.5, 0)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
        ctx.stroke();
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();

  /* ── HERO IMAGE TILT 3D ── */
  (function initTilt() {
    const wrap  = document.querySelector('.hero-right');
    const frame = document.querySelector('.hero-img-frame');
    if (!wrap || !frame || prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

    wrap.addEventListener('mousemove', e => {
      const rect = wrap.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width  - 0.5;
      const py = (e.clientY - rect.top)  / rect.height - 0.5;
      frame.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateZ(10px)`;
    });
    wrap.addEventListener('mouseleave', () => {
      frame.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)';
    });
  })();

  /* ── BOTONES MAGNÉTICOS ── */
  (function initMagneticButtons() {
    if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;
    const targets = document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta, .prog-cta');
    targets.forEach(btn => {
      const strength = 0.25;
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const mx = e.clientX - (rect.left + rect.width / 2);
        const my = e.clientY - (rect.top + rect.height / 2);
        btn.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  })();

  /* ── RIPPLE AL HACER CLICK ── */
  (function initRipple() {
    const targets = document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta, .prog-cta');
    targets.forEach(btn => {
      btn.addEventListener('click', e => {
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      });
    });
  })();

  /* ── LAP TIMER — cronómetro HUD en vivo ── */
  (function initLapTimer() {
    const lapEl = document.getElementById('tel-lap');
    if (!lapEl) return;
    let lapStart = performance.now();
    const LAP_DURATION = 87400; // ~1:27.4, referencia ficticia de vuelta rápida

    function pad(n, len) { return String(Math.floor(n)).padStart(len, '0'); }

    function tick() {
      let elapsed = performance.now() - lapStart;
      if (elapsed >= LAP_DURATION) {
        lapStart = performance.now();
        elapsed = 0;
      }
      const mins = Math.floor(elapsed / 60000);
      const secs = Math.floor((elapsed % 60000) / 1000);
      const ms   = Math.floor(elapsed % 1000);
      lapEl.textContent = `${pad(mins, 2)}:${pad(secs, 2)}.${pad(ms, 3)}`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();

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

  /* ── FLIP CARDS: EXPERIENCIAS ── */
  circuits.forEach(card => {
    const flip = () => card.classList.toggle('flipped');

    card.addEventListener('click', flip);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip();
      }
    });
  });

  /* ── FLIP CARDS: PROGRAMAS ── */
  document.querySelectorAll('.prog-card').forEach(card => {
    const flip = () => card.classList.toggle('flipped');

    card.addEventListener('click', flip);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip();
      }
    });

    // El botón "Comenzar" navega directo, sin disparar el flip
    const cta = card.querySelector('.prog-cta');
    if (cta) cta.addEventListener('click', e => e.stopPropagation());
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
      if (frame >= totalFrames) { el.textContent = finalText; clearInterval(interval); }
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
  function initCarousel(track, dotsContainer, prevBtn, nextBtn) {
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

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

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
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setupCarousels, 200);
  });

  /* ── TECH CAROUSEL: una tarjeta grande a la vez, en todos los tamaños ── */
  const techTrack = document.querySelector('.tech-track');
  const techDots  = document.querySelector('.tech-carousel-dots');
  const techPrev  = document.querySelector('.tech-arrow-prev');
  const techNext  = document.querySelector('.tech-arrow-next');
  if (techTrack && !techTrack.dataset.carouselInit) {
    initCarousel(techTrack, techDots, techPrev, techNext);
    techTrack.dataset.carouselInit = 'true';
  }
/*═══════════════════════════════
      MEDIA SLIDER
═══════════════════════════════*/

const mediaSlides = document.querySelectorAll(".media-slide");

if(mediaSlides.length){

    let current = 0;

    setInterval(()=>{

        mediaSlides[current].classList.remove("active");

        current++;

        if(current >= mediaSlides.length){
            current = 0;
        }

        mediaSlides[current].classList.add("active");

    },3000);

}
});
