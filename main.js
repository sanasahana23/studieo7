/* ============================================
   STUDIEO7 — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky Header ---------- */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* ---------- Mobile Navigation ---------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll Reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------- Testimonial Carousel ---------- */
  const track = document.querySelector('.testimonial-track');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  if (track && prevBtn && nextBtn) {
    let currentSlide = 0;
    const cards = track.querySelectorAll('.testimonial-card');
    const getVisibleCount = () => {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    };

    const updateCarousel = () => {
      const visibleCount = getVisibleCount();
      const maxSlide = Math.max(0, cards.length - visibleCount);
      currentSlide = Math.min(currentSlide, maxSlide);
      const pct = (100 / cards.length) * currentSlide;
      track.style.transform = `translateX(-${pct}%)`;
    };

    nextBtn.addEventListener('click', () => {
      const visibleCount = getVisibleCount();
      const maxSlide = Math.max(0, cards.length - visibleCount);
      if (currentSlide < maxSlide) { currentSlide++; updateCarousel(); }
    });

    prevBtn.addEventListener('click', () => {
      if (currentSlide > 0) { currentSlide--; updateCarousel(); }
    });

    window.addEventListener('resize', updateCarousel);

    // Auto-advance
    setInterval(() => {
      const visibleCount = getVisibleCount();
      const maxSlide = Math.max(0, cards.length - visibleCount);
      currentSlide = currentSlide < maxSlide ? currentSlide + 1 : 0;
      updateCarousel();
    }, 5000);
  }

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasActive = item.classList.contains('active');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  /* ---------- Gallery Filters ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.masonry-item');
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        galleryItems.forEach(item => {
          if (cat === 'all' || item.dataset.category === cat) {
            item.style.display = 'block';
            setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => { item.style.display = 'none'; }, 400);
          }
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbClose = document.querySelector('.lightbox-close');
  if (lightbox && lbImg) {
    document.querySelectorAll('[data-lightbox]').forEach(el => {
      el.addEventListener('click', () => {
        lbImg.src = el.dataset.lightbox;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  }

  /* ---------- Before/After Slider ---------- */
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const afterEl = slider.querySelector('.ba-after');
    const handle = slider.querySelector('.ba-handle');
    let isDown = false;

    const move = (x) => {
      const rect = slider.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.max(5, Math.min(95, pct));
      afterEl.style.width = pct + '%';
      handle.style.left = pct + '%';
    };

    slider.addEventListener('mousedown', (e) => { isDown = true; move(e.clientX); });
    document.addEventListener('mousemove', (e) => { if (isDown) move(e.clientX); });
    document.addEventListener('mouseup', () => { isDown = false; });

    slider.addEventListener('touchstart', (e) => { isDown = true; move(e.touches[0].clientX); });
    document.addEventListener('touchmove', (e) => { if (isDown) move(e.touches[0].clientX); });
    document.addEventListener('touchend', () => { isDown = false; });
  });

  /* ---------- Exit Intent Popup ---------- */
  const popup = document.querySelector('.popup-overlay');
  const popupClose = document.querySelector('.popup-close');
  let popupShown = false;
  if (popup) {
    document.addEventListener('mouseout', (e) => {
      if (!popupShown && e.clientY < 10 && !e.relatedTarget && !e.toElement) {
        popup.classList.add('active');
        popupShown = true;
        document.body.style.overflow = 'hidden';
      }
    });
    const closePopup = () => {
      popup.classList.remove('active');
      document.body.style.overflow = '';
    };
    if (popupClose) popupClose.addEventListener('click', closePopup);
    popup.addEventListener('click', (e) => { if (e.target === popup) closePopup(); });
  }

  /* ---------- Countdown Timer ---------- */
  const countdownEl = document.querySelector('.countdown');
  if (countdownEl) {
    // Next wedding season or a set future date (60 days from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 60);

    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff <= 0) return;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      const daysEl = document.getElementById('cd-days');
      const hoursEl = document.getElementById('cd-hours');
      const minsEl = document.getElementById('cd-mins');
      const secsEl = document.getElementById('cd-secs');

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ---------- Form Validation ---------- */
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('[required]').forEach(input => {
        const group = input.closest('.form-group');
        if (!input.value.trim()) {
          if (group) group.classList.add('error');
          valid = false;
        } else {
          if (group) group.classList.remove('error');
        }
      });

      // Phone validation
      form.querySelectorAll('input[type="tel"]').forEach(tel => {
        const group = tel.closest('.form-group');
        if (tel.value && !/^[0-9+\-\s()]{7,15}$/.test(tel.value)) {
          if (group) group.classList.add('error');
          valid = false;
        }
      });

      // Email validation
      form.querySelectorAll('input[type="email"]').forEach(email => {
        const group = email.closest('.form-group');
        if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
          if (group) group.classList.add('error');
          valid = false;
        }
      });

      if (valid) {
        // Show success modal
        const modal = document.querySelector('.success-modal');
        if (modal) {
          modal.classList.add('active');
          setTimeout(() => { modal.classList.remove('active'); }, 4000);
        }
        form.reset();
      }
    });

    // Clear error on input
    form.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group) group.classList.remove('error');
      });
    });
  });

  /* ---------- Smooth Scroll for anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Counter Animation ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const duration = 2000;
          const start = performance.now();

          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ---------- WhatsApp Link ---------- */
  const whatsappNumber = '917891011387';
  document.querySelectorAll('.whatsapp-link').forEach(el => {
    el.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi Studieo7! I would like to book an appointment.')}`;
    el.target = '_blank';
  });

  document.querySelectorAll('.whatsapp-bridal').forEach(el => {
    el.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi Studieo7! I am interested in your bridal packages. Please share more details.')}`;
    el.target = '_blank';
  });

  /* ---------- Active Nav Link ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});
