// Growth with Grace — shared interactions

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const nav = document.querySelector('nav');

  if (header) {
    const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  // Mobile navigation is injected so the existing page markup stays lightweight.
  if (nav && !document.querySelector('.menu-toggle')) {
    const toggle = document.createElement('button');
    toggle.className = 'menu-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Open navigation');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    nav.parentElement.insertBefore(toggle, nav);

    const closeMenu = () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
    };

    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  }

  // Active page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  // Back to top
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.type = 'button';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.textContent = '↑';
  document.body.appendChild(backToTop);
  const updateTopButton = () => backToTop.classList.toggle('show', window.scrollY > 500);
  updateTopButton();
  window.addEventListener('scroll', updateTopButton, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Gallery lightbox
  const grids = [...document.querySelectorAll('.gallery-grid')];
  if (grids.length) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Close image viewer">×</button>
      <button class="lightbox-arrow lightbox-prev" type="button" aria-label="Previous image">‹</button>
      <img class="lightbox-img" src="" alt="">
      <button class="lightbox-arrow lightbox-next" type="button" aria-label="Next image">›</button>
      <div class="lightbox-counter" aria-live="polite"></div>`;
    document.body.appendChild(overlay);

    const imageEl = overlay.querySelector('.lightbox-img');
    const counter = overlay.querySelector('.lightbox-counter');
    let group = [];
    let index = 0;

    const render = () => {
      const source = group[index];
      imageEl.src = source.src;
      imageEl.alt = source.alt || 'Growth with Grace community photograph';
      counter.textContent = `${index + 1} / ${group.length}`;
    };
    const open = (images, i) => {
      group = images;
      index = i;
      render();
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    };
    const next = () => { index = (index + 1) % group.length; render(); };
    const prev = () => { index = (index - 1 + group.length) % group.length; render(); };

    grids.forEach(grid => {
      const images = [...grid.querySelectorAll('img')];
      images.forEach((img, i) => img.addEventListener('click', () => open(images, i)));
    });
    overlay.querySelector('.lightbox-close').addEventListener('click', close);
    overlay.querySelector('.lightbox-next').addEventListener('click', next);
    overlay.querySelector('.lightbox-prev').addEventListener('click', prev);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => {
      if (!overlay.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });

    let touchStartX = 0;
    overlay.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    overlay.addEventListener('touchend', e => {
      const delta = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 50) delta < 0 ? next() : prev();
    }, { passive: true });
  }

  // Copyable contact details
  const toast = document.createElement('div');
  toast.className = 'copy-toast';
  toast.textContent = 'Copied to clipboard';
  document.body.appendChild(toast);
  document.querySelectorAll('.copy-text').forEach(el => {
    el.setAttribute('title', 'Click to copy');
    el.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(el.textContent.trim());
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 1600);
      } catch (_) { /* Clipboard may be unavailable in some browsers. */ }
    });
  });

  // Event countdown
  const countdown = document.getElementById('event-countdown');
  if (countdown) {
    const target = new Date(countdown.dataset.date).getTime();
    const units = {
      days: countdown.querySelector('.cd-days'),
      hours: countdown.querySelector('.cd-hours'),
      mins: countdown.querySelector('.cd-mins'),
      secs: countdown.querySelector('.cd-secs')
    };
    let timer;
    const update = () => {
      const distance = target - Date.now();
      if (distance <= 0) {
        countdown.innerHTML = '<p style="color:var(--wine);font-weight:700">This event has passed.</p>';
        clearInterval(timer);
        return;
      }
      units.days.textContent = Math.floor(distance / 86400000);
      units.hours.textContent = Math.floor(distance / 3600000) % 24;
      units.mins.textContent = Math.floor(distance / 60000) % 60;
      units.secs.textContent = Math.floor(distance / 1000) % 60;
    };
    update();
    timer = setInterval(update, 1000);
  }
});
