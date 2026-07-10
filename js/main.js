/* ===== CAR LED SYSTEM - MAIN ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ===== NAVIGATION ===== */
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
  }

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* ===== ACTIVE NAV LINK ===== */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
    if (currentPage === '' || currentPage === 'index.html') {
      if (href === 'index.html') {
        link.classList.add('active');
      }
    }
  });

  /* ===== SCROLL ANIMATIONS ===== */
  const animateElements = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, entry.target.dataset.delay || index * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  animateElements.forEach(el => observer.observe(el));

  /* ===== COUNTER ===== */
  function animateCounter(element, target) {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.round(current) + '+';
    }, stepTime);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter-number').forEach(el => {
    counterObserver.observe(el);
  });

  /* ===== FAQ ===== */
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* ===== GALLERY FILTERS ===== */
  const filterButtons = document.querySelectorAll('.gallery-filter');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ===== LIGHTBOX ===== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const lightboxPrev = lightbox?.querySelector('.lightbox-nav.prev');
  const lightboxNext = lightbox?.querySelector('.lightbox-nav.next');

  let currentLightboxIndex = 0;
  let lightboxImages = [];

  document.querySelectorAll('.gallery-item').forEach((item, index) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      lightboxImages = [];
      document.querySelectorAll('.gallery-item img').forEach(el => {
        lightboxImages.push(el.src);
      });
      currentLightboxIndex = lightboxImages.indexOf(img.src);
      openLightbox(img.src);
    });
  });

  function openLightbox(src) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    currentLightboxIndex += direction;
    if (currentLightboxIndex < 0) currentLightboxIndex = lightboxImages.length - 1;
    if (currentLightboxIndex >= lightboxImages.length) currentLightboxIndex = 0;
    lightboxImg.src = lightboxImages[currentLightboxIndex];
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => navigateLightbox(-1));
  lightboxNext?.addEventListener('click', () => navigateLightbox(1));

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  /* ===== COMPARISON SLIDER ===== */
  document.querySelectorAll('.comparison-item').forEach(item => {
    const slider = item.querySelector('.comparison-slider');
    const afterImg = item.querySelector('.comparison-img-after');
    let isDragging = false;

    function updateSlider(x) {
      const rect = item.getBoundingClientRect();
      let pos = (x - rect.left) / rect.width;
      pos = Math.max(0, Math.min(1, pos));
      const percent = pos * 100;
      slider.style.left = percent + '%';
      if (afterImg) {
        afterImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      }
    }

    slider?.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    slider?.addEventListener('touchstart', (e) => {
      isDragging = true;
      e.preventDefault();
    });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      updateSlider(touch.clientX);
    });

    document.addEventListener('touchend', () => {
      isDragging = false;
    });
  });

  /* ===== BACK TO TOP ===== */
  const backToTop = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop?.classList.add('visible');
    } else {
      backToTop?.classList.remove('visible');
    }
  }, { passive: true });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ===== SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  document.querySelectorAll('a[href*="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href.includes('#')) return;
      const targetId = href.split('#')[1];
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = 100;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    });
  });

  /* ===== FORM ===== */
  const contactForm = document.querySelector('.contact-form form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn');
    const originalText = btn.textContent;
    btn.textContent = '✓ Enviado';
    btn.style.background = '#22c55e';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });

  /* ===== CARDS REVEAL ===== */
  const serviceCards = document.querySelectorAll('.service-card, .pack-card, .why-card, .testimonial-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 60);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  serviceCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    cardObserver.observe(card);
  });

  /* ===== PARALLAX ===== */
  window.addEventListener('scroll', () => {
    const heroBg = document.querySelector('.hero-bg img, .hero-bg video');
    if (heroBg && window.scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${window.scrollY * 0.2}px)`;
    }
  }, { passive: true });

});
