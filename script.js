// ===============================
// GROWTH WITH GRACE PARIVAR
// script.js
// ===============================


// Navbar shadow on scroll

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    if(window.scrollY > 40){
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});
// ======================================================
// LIGHTBOX / IMAGE VIEWER
// ======================================================

document.addEventListener('DOMContentLoaded', function () {

    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <span class="lightbox-arrow lightbox-prev">&#10094;</span>
        <img class="lightbox-img" src="" alt="">
        <span class="lightbox-arrow lightbox-next">&#10095;</span>
    `;
    document.body.appendChild(overlay);

    const lightboxImg = overlay.querySelector('.lightbox-img');
    const closeBtn = overlay.querySelector('.lightbox-close');
    const prevBtn = overlay.querySelector('.lightbox-prev');
    const nextBtn = overlay.querySelector('.lightbox-next');

    let currentGroup = [];
    let currentIndex = 0;

    function openLightbox(imagesInGroup, index) {
        currentGroup = imagesInGroup;
        currentIndex = index;
        lightboxImg.src = currentGroup[currentIndex].src;
        overlay.classList.add('active');
    }

    function closeLightbox() {
        overlay.classList.remove('active');
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % currentGroup.length;
        lightboxImg.src = currentGroup[currentIndex].src;
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
        lightboxImg.src = currentGroup[currentIndex].src;
    }

    // Each .gallery-grid is treated as its own group to cycle through
    document.querySelectorAll('.gallery-grid').forEach(grid => {
        const imagesInGroup = Array.from(grid.querySelectorAll('img'));
        imagesInGroup.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(imagesInGroup, index));
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    // basic swipe support for mobile
    let touchStartX = 0;
    overlay.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    overlay.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) showNext();
        if (touchEndX > touchStartX + 50) showPrev();
    });

});
// ======================================================
// BACK TO TOP BUTTON
// ======================================================

document.addEventListener('DOMContentLoaded', function () {

    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '&uarr;';
    document.body.appendChild(backToTop);

    function checkScroll() {
        const scrolled = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        if (scrolled > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});

// ======================================================
// ACTIVE NAV LINK HIGHLIGHT
// ======================================================

document.addEventListener('DOMContentLoaded', function () {

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('nav a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

});

// ======================================================
// COPY TO CLIPBOARD (phone / email)
// ======================================================

document.addEventListener('DOMContentLoaded', function () {

    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.textContent = 'Copied!';
    document.body.appendChild(toast);

    document.querySelectorAll('.copy-text').forEach(el => {
        el.addEventListener('click', () => {
            navigator.clipboard.writeText(el.textContent.trim()).then(() => {
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 1800);
            });
        });
    });

});
// ======================================================
// EVENT COUNTDOWN
// ======================================================

document.addEventListener('DOMContentLoaded', function () {

    const countdownEl = document.getElementById('event-countdown');
    if (!countdownEl) return;

    const targetDate = new Date(countdownEl.dataset.date).getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            countdownEl.innerHTML = '<p style="font-size:1.2rem;color:var(--primary);font-weight:600;">This event has passed</p>';
            clearInterval(timer);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownEl.querySelector('.cd-days').textContent = days;
        countdownEl.querySelector('.cd-hours').textContent = hours;
        countdownEl.querySelector('.cd-mins').textContent = minutes;
        countdownEl.querySelector('.cd-secs').textContent = seconds;
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

});
// ======================================================
// LIGHTBOX IMAGE COUNTER
// ======================================================

document.addEventListener('DOMContentLoaded', function () {

    const overlay = document.querySelector('.lightbox-overlay');
    if (!overlay) return;

    const counter = document.createElement('div');
    counter.className = 'lightbox-counter';
    overlay.appendChild(counter);

    // Watch for src changes on the lightbox image to update the counter
    const imgEl = overlay.querySelector('.lightbox-img');
    const observer = new MutationObserver(() => {
        const allImgsInOverlay = document.querySelectorAll('.gallery-grid img');
        let group = null;
        let index = 0;

        document.querySelectorAll('.gallery-grid').forEach(grid => {
            const imgs = Array.from(grid.querySelectorAll('img'));
            const found = imgs.findIndex(i => i.src === imgEl.src);
            if (found !== -1) {
                group = imgs;
                index = found;
            }
        });

        if (group) {
            counter.textContent = `${index + 1} / ${group.length}`;
        }
    });

    observer.observe(imgEl, { attributes: true, attributeFilter: ['src'] });

});
