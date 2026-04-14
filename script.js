/* ====================================================
   Software Native Institute – script.js
   Fixed: hamburger menu uses HTML overlay (no JS-injected
   backdrop-filter blur), clean open/close with CSS transitions.
==================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     1.  STICKY NAVBAR
  ────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });


  /* ──────────────────────────────────────────────
     2.  MOBILE MENU
     Uses the .menu-overlay element already in HTML.
     No backdrop-filter — avoids the blur glitch.
  ────────────────────────────────────────────── */
  const hamburger   = document.getElementById('hamburger');
  const navLinks    = document.getElementById('navLinks');
  const menuOverlay = document.getElementById('menuOverlay');

  function openMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('open');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  menuOverlay.addEventListener('click', closeMenu);

  // Close on any nav link click
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', closeMenu)
  );

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });


  /* ──────────────────────────────────────────────
     3.  ACTIVE NAV LINK ON SCROLL
  ────────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const links    = document.querySelectorAll('.nav-link');

  function setActive() {
    const y = window.scrollY + navbar.offsetHeight + 20;
    sections.forEach(sec => {
      if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
        links.forEach(l =>
          l.classList.toggle('active', l.getAttribute('href') === '#' + sec.id)
        );
      }
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });


  /* ──────────────────────────────────────────────
     4.  HERO TYPEWRITER
  ────────────────────────────────────────────── */
  const heroTyped = document.getElementById('heroTyped');
  if (heroTyped) {
    const phrases = [
  'Expert English Trainers',
  'Practical Speaking Practice',
  'Confidence & Fluency Building',
  'Spoken English Skills',
  'Real-life Conversation Training',
];
    let pi = 0, ci = 0, deleting = false;
    const cursor = '<span class="cursor">|</span>';

    function type() {
      const current = phrases[pi];
      if (!deleting) {
        ci++;
        heroTyped.innerHTML = current.slice(0, ci) + cursor;
        if (ci === current.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
        setTimeout(type, 70);
      } else {
        ci--;
        heroTyped.innerHTML = current.slice(0, ci) + cursor;
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          setTimeout(type, 300);
          return;
        }
        setTimeout(type, 38);
      }
    }
    setTimeout(type, 800);
  }


  /* ──────────────────────────────────────────────
     5.  PARTICLE CANVAS (hero background)
  ────────────────────────────────────────────── */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.r  = Math.random() * 2 + 0.5;
        this.vx = (Math.random() - .5) * .4;
        this.vy = (Math.random() - .5) * .4;
        this.alpha = Math.random() * .5 + .1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    function loop() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${.06 * (1 - dist / 120)})`;
            ctx.lineWidth = .6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(loop);
    }
    loop();
  }


  /* ──────────────────────────────────────────────
     6.  COUNTER ANIMATION (hero stats)
  ────────────────────────────────────────────── */
  const statNums = document.querySelectorAll('.hstat-n[data-target]');
  let countersDone = false;

  function animateCounter(el, target) {
    const isThousand    = target >= 1000;
    const displayTarget = isThousand ? target / 1000 : target;
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const t    = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const val  = displayTarget * ease;
      el.textContent = (isThousand ? val.toFixed(1) : Math.round(val)) + (isThousand ? 'K' : '');
      if (t < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats && statNums.length) {
    const so = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !countersDone) {
        countersDone = true;
        statNums.forEach(el => animateCounter(el, +el.dataset.target));
        so.disconnect();
      }
    }, { threshold: .5 });
    so.observe(heroStats);
  }


  /* ──────────────────────────────────────────────
     7.  SCROLL-FADE (IntersectionObserver)
  ────────────────────────────────────────────── */
  const fadeEls = document.querySelectorAll('.scroll-fade');
  if (fadeEls.length) {
    const fo = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          fo.unobserve(e.target);
        }
      });
    }, { threshold: .1, rootMargin: '0px 0px -30px 0px' });
    fadeEls.forEach(el => fo.observe(el));
  }


  /* ──────────────────────────────────────────────
     8.  REUSABLE SLIDER BUILDER
  ────────────────────────────────────────────── */
  function buildSlider({ trackId, prevId, nextId, dotsId, slidesPerView = 4, autoMs = 3500, gap = 16 }) {
    const track    = document.getElementById(trackId);
    const prevBtn  = document.getElementById(prevId);
    const nextBtn  = document.getElementById(nextId);
    const dotsWrap = document.getElementById(dotsId);
    if (!track) return;

    // The slider viewport element (has overflow:hidden and a real rendered width)
    const sliderEl = track.closest('.courses-slider') || track.parentElement;

    const slides = Array.from(track.children);
    const total  = slides.length;
    let cur = 0, spv = slidesPerView, autoTimer;

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      const maxCur = total - spv;
      for (let i = 0; i <= maxCur; i++) {
        const d = document.createElement('button');
        d.className = 'cc-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', `Slide ${i + 1}`);
        d.addEventListener('click', () => { goTo(i); resetAuto(); });
        dotsWrap.appendChild(d);
      }
    }

    function updateDots() {
      if (!dotsWrap) return;
      dotsWrap.querySelectorAll('.cc-dot').forEach((d, i) =>
        d.classList.toggle('active', i === cur)
      );
    }

    // Read the card width from its actual rendered size (set via CSS variable).
    // Adding `gap` gives us the step distance per slide position.
    function getSlideStep() {
      if (!slides[0]) return 0;
      return slides[0].getBoundingClientRect().width + gap;
    }

    function goTo(index) {
      const maxCur = total - spv;
      cur = Math.max(0, Math.min(index, maxCur));
      track.style.transform = `translateX(-${cur * getSlideStep()}px)`;
      updateDots();
    }

    function next() { goTo(cur + 1 > total - spv ? 0 : cur + 1); }
    function prev() { goTo(cur - 1 < 0 ? total - spv : cur - 1); }

    prevBtn && prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
    nextBtn && nextBtn.addEventListener('click', () => { next(); resetAuto(); });

    function startAuto() { autoTimer = setInterval(next, autoMs); }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }

    function onResize() {
      const w = window.innerWidth;
      spv = w < 600 ? 1 : w < 900 ? 2 : w < 1100 ? 3 : slidesPerView;

      /*
        KEY FIX: measure the slider element's actual rendered width (pixels),
        not a percentage of the flex track. This is always ≤ viewport width.
        We set --card-width as a CSS custom property on the slider element,
        which cascades to all .ccard children via their CSS rule.
        Subtracting (gap * (spv-1)) distributes the gap space correctly.
      */
      const sliderWidth = sliderEl.getBoundingClientRect().width;
      const cardWidth   = (sliderWidth - gap * (spv - 1)) / spv;
      sliderEl.style.setProperty('--card-width', cardWidth + 'px');

      // Remove any stale inline min-width that old code may have set
      slides.forEach(s => { s.style.minWidth = ''; s.style.width = ''; });

      buildDots();
      // Clamp current position in case spv increased and maxCur shrank
      goTo(Math.min(cur, Math.max(0, total - spv)));
    }

    window.addEventListener('resize', onResize, { passive: true });
    onResize();

    // Drag support
    let startX = 0, isDragging = false;
    track.addEventListener('mousedown', e => { startX = e.clientX; isDragging = true; });
    track.addEventListener('mousemove', e => { if (isDragging) e.preventDefault(); });
    track.addEventListener('mouseup', e => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - e.clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); resetAuto(); }
    });
    track.addEventListener('mouseleave', () => { isDragging = false; });

    // Touch support
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); resetAuto(); }
    }, { passive: true });

    // Pause on hover
    const wrapper = track.closest('.courses-slider, .testi-slider');
    wrapper?.addEventListener('mouseenter', () => clearInterval(autoTimer));
    wrapper?.addEventListener('mouseleave', startAuto);

    startAuto();
  }

  buildSlider({
    trackId: 'coursesTrack',
    prevId:  'ccPrev',
    nextId:  'ccNext',
    dotsId:  'ccDots',
    slidesPerView: 4,
    autoMs: 3800,
    gap: 16,
  });


  /* ──────────────────────────────────────────────
     9.  TESTIMONIALS SLIDER
  ────────────────────────────────────────────── */
  const testiTrack = document.getElementById('testiTrack');
  const tPrev      = document.getElementById('tPrev');
  const tNext      = document.getElementById('tNext');
  const tDotsWrap  = document.getElementById('tDots');

  if (testiTrack) {
    const tSlides = Array.from(testiTrack.children);
    const tTotal  = tSlides.length;
    let tCur = 0, tTimer;

    tSlides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'cc-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Testimonial ${i + 1}`);
      d.addEventListener('click', () => { tGoTo(i); tResetAuto(); });
      tDotsWrap.appendChild(d);
    });

    function tUpdateDots() {
      tDotsWrap.querySelectorAll('.cc-dot').forEach((d, i) =>
        d.classList.toggle('active', i === tCur)
      );
    }

    function tGoTo(idx) {
      tCur = (idx + tTotal) % tTotal;
      testiTrack.style.transform = `translateX(-${tCur * 100}%)`;
      tUpdateDots();
    }

    function tNextFn() { tGoTo(tCur + 1); }
    function tPrevFn() { tGoTo(tCur - 1); }

    tPrev && tPrev.addEventListener('click', () => { tPrevFn(); tResetAuto(); });
    tNext && tNext.addEventListener('click', () => { tNextFn(); tResetAuto(); });

    function tStartAuto() { tTimer = setInterval(tNextFn, 5000); }
    function tResetAuto()  { clearInterval(tTimer); tStartAuto(); }

    let tStartX = 0;
    testiTrack.addEventListener('touchstart', e => { tStartX = e.touches[0].clientX; }, { passive: true });
    testiTrack.addEventListener('touchend', e => {
      const diff = tStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? tNextFn() : tPrevFn(); tResetAuto(); }
    }, { passive: true });

    const testiWrapper = testiTrack.closest('.testi-slider');
    testiWrapper?.addEventListener('mouseenter', () => clearInterval(tTimer));
    testiWrapper?.addEventListener('mouseleave', tStartAuto);

    tStartAuto();
  }


  /* ──────────────────────────────────────────────
     10.  CONTACT FORM VALIDATION
  ────────────────────────────────────────────── */
  const form = document.getElementById('contForm');
  if (form) {
    const fSuccess = document.getElementById('fSuccess');

    function showErr(id, msg) {
      const el = document.getElementById(id);
      if (el) el.textContent = msg;
    }
    function clearErrs() {
      ['fnErr', 'fpErr', 'feErr'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
      });
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      clearErrs();
      let valid = true;

      const name  = document.getElementById('fn').value.trim();
      const phone = document.getElementById('fp').value.trim();
      const email = document.getElementById('fe').value.trim();

      if (!name) { showErr('fnErr', 'Name is required.'); valid = false; }
      if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
        showErr('fpErr', 'Enter a valid 10-digit Indian mobile number.');
        valid = false;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showErr('feErr', 'Enter a valid email address.');
        valid = false;
      }

      if (valid) {
        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Sending…';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'SUBMIT →';
          btn.disabled = false;
          form.reset();
          fSuccess.style.display = 'block';
          setTimeout(() => { fSuccess.style.display = 'none'; }, 5000);
        }, 1200);
      }
    });

    ['fn', 'fp', 'fe'].forEach(id => {
      const inp = document.getElementById(id);
      if (inp) inp.addEventListener('input', () => {
        const el = document.getElementById(id + 'Err');
        if (el) el.textContent = '';
      });
    });
  }


  /* ──────────────────────────────────────────────
     11.  BACK-TO-TOP
  ────────────────────────────────────────────── */
  const btt = document.getElementById('btt');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }


  /* ──────────────────────────────────────────────
     12.  SMOOTH SCROLL (offset for sticky navbar)
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 8;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth',
        });
      }
    });
  });


  /* ──────────────────────────────────────────────
     13.  DARK MODE TOGGLE
  ────────────────────────────────────────────── */
  (function () {
    const STORAGE_KEY = 'sni_dark_mode';
    const body     = document.body;
    const checkbox = document.getElementById('dmToggle');
    if (!checkbox) return;

    function applyPreference() {
      const saved       = localStorage.getItem(STORAGE_KEY);
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      const shouldBeDark = saved !== null ? saved === 'true' : prefersDark;
      if (shouldBeDark) {
        body.classList.add('dark');
        checkbox.checked = true;
      }
    }

    function onToggle() {
      const isDark = checkbox.checked;
      body.classList.toggle('dark', isDark);
      localStorage.setItem(STORAGE_KEY, isDark);
    }

    applyPreference();
    checkbox.addEventListener('change', onToggle);

    window.toggleDarkMode = function () {
      checkbox.checked = !checkbox.checked;
      onToggle();
    };
  })();

}); // end DOMContentLoaded