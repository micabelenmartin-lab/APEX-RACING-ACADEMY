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

  /* ── PARTICLE CANVAS ── */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const N = 60;
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * 1200,
        y: Math.random() * 700,
        vx: (Math.random() - .5) * .35,
        vy: (Math.random() - .5) * .35,
        r: Math.random() * 1.2 + .3,
        c: Math.random() > .5 ? '0,255,136' : '191,95,255',
        o: Math.random() * .5 + .2,
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.o})`;
        ctx.fill();
      });
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / 110) * .12;
            ctx.strokeStyle = `rgba(0,255,136,${alpha})`;
            ctx.lineWidth = .5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
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
  const secs = document.querySelectorAll('section[id]');
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
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) / (r.width / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      card.style.transform = `perspective(600px) rotateY(${dx * 4}deg) rotateX(${-dy * 3}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .5s ease';
    });
  });

  /* ── NUMBER COUNTERS (hero) ── */
  // Removed stats bar per request — counters kept for potential re-use

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

  // Trigger scramble when CTA enters view
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

});
