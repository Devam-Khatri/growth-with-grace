// Growth with Grace — shared interactions

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const nav = document.querySelector('nav');
  const menuToggle = document.querySelector('.menu-toggle');

  if (header) {
    const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  if (nav && menuToggle) {
    nav.id = nav.id || 'site-navigation';
    menuToggle.setAttribute('aria-controls', nav.id);
    const closeMenu = () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    };
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('click', event => {
      if (nav.classList.contains('open') && !nav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

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

  const grids = [...document.querySelectorAll('.gallery-grid')];
  if (grids.length) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image viewer');
    overlay.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close image viewer">×</button><button class="lightbox-arrow lightbox-prev" type="button" aria-label="Previous image">‹</button><img class="lightbox-img" src="" alt=""><button class="lightbox-arrow lightbox-next" type="button" aria-label="Next image">›</button><div class="lightbox-counter" aria-live="polite"></div>';
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
      overlay.querySelector('.lightbox-close').focus();
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
    overlay.addEventListener('click', event => { if (event.target === overlay) close(); });
    document.addEventListener('keydown', event => {
      if (!overlay.classList.contains('active')) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') prev();
    });
    let touchStartX = 0;
    overlay.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
    overlay.addEventListener('touchend', event => {
      const delta = event.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 50) delta < 0 ? next() : prev();
    }, { passive: true });
  }

  const copyable = document.querySelectorAll('.copy-text');
  if (copyable.length) {
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
    copyable.forEach(el => {
      el.setAttribute('title', 'Click to copy');
      el.addEventListener('click', async event => {
        if (event.detail === 0) return;
        try {
          await navigator.clipboard.writeText(el.textContent.trim());
          toast.textContent = 'Copied';
          toast.classList.add('show');
          window.setTimeout(() => toast.classList.remove('show'), 1600);
        } catch (_) {
          // The link still performs its normal phone or email action if clipboard access is unavailable.
        }
      });
    });
  }

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
        countdown.innerHTML = '<p class="countdown-ended">This event has passed.</p>';
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

  const entrepreneurSearch = document.getElementById('entrepreneur-search');
  const entrepreneurGrid = document.getElementById('entrepreneurs-grid');
  if (entrepreneurSearch && entrepreneurGrid) {
    const cards = [...entrepreneurGrid.querySelectorAll('.entrepreneur-card')];
    const count = document.getElementById('entrepreneur-count');
    const empty = document.getElementById('entrepreneur-empty');
    const clear = document.getElementById('clear-entrepreneur-search');
    const filter = () => {
      const query = entrepreneurSearch.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach(card => {
        const matches = !query || card.dataset.search.includes(query);
        card.classList.toggle('is-hidden', !matches);
        if (matches) visible += 1;
      });
      if (count) count.textContent = visible;
      if (empty) empty.hidden = visible !== 0;
    };
    entrepreneurSearch.addEventListener('input', filter);
    clear?.addEventListener('click', () => {
      entrepreneurSearch.value = '';
      entrepreneurSearch.focus();
      filter();
    });
  }

});
