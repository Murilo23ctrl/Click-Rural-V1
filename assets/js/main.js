document.addEventListener('DOMContentLoaded', () => {

  /* Ano automático no rodapé */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== Header: transparente no hero, sólido depois ===== */
  const header = document.getElementById('siteHeader');
  const hero = document.getElementById('inicio');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroWrap = document.querySelector('.hero-bg-wrap');

  const toggleHeaderState = () => {
    const y = window.scrollY;
    const heroH = hero ? hero.offsetHeight : 0;
    header.classList.toggle('is-scrolled', y > 40);
    header.classList.toggle('is-over-hero', y < Math.max(heroH - 72, 0));
    if (!reduceMotion && heroWrap && y < heroH) {
      heroWrap.style.transform = `translate3d(0, ${y * 0.22}px, 0)`;
    }
  };
  toggleHeaderState();
  window.addEventListener('scroll', toggleHeaderState, { passive: true });

  /* ===== Menu mobile ===== */
  const navToggle = document.getElementById('navToggle');
  const navToggleIcon = document.getElementById('navToggleIcon');
  const mainNav = document.getElementById('mainNav');

  const closeNav = () => {
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggleIcon.setAttribute('href', '#icon-menu');
  };
  const openNav = () => {
    document.body.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggleIcon.setAttribute('href', '#icon-close');
  };

  navToggle.addEventListener('click', () => {
    document.body.classList.contains('nav-open') ? closeNav() : openNav();
  });
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) closeNav();
  });

  /* ===== Stagger nas grades ===== */
  document.querySelectorAll('.specialty-grid, .gallery-grid, .testimonial-grid, .process-grid, .animals-grid, .instagram-grid, .masonry, .childhood-thumbs').forEach(grid => {
    [...grid.children].forEach((child, i) => {
      child.style.setProperty('--stagger', `${Math.min(i, 8) * 0.07}s`);
    });
  });

  /* ===== Animações de entrada (fade-up ao rolar) ===== */
  const revealEls = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ===== Galeria: filtros por categoria ===== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  const applyFilter = (filter) => {
    filterBtns.forEach(btn => btn.classList.toggle('is-active', btn.dataset.filter === filter));
    galleryItems.forEach(item => {
      const match = filter === 'todos' || item.dataset.category === filter;
      item.classList.toggle('is-hidden', !match);
    });
  };

  filterBtns.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));

  /* Cards de "Especialidades" filtram a galeria e rolam até o portfólio */
  document.querySelectorAll('.specialty-link[data-filter]').forEach(link => {
    link.addEventListener('click', () => applyFilter(link.dataset.filter));
  });

  /* ===== Lightbox ===== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentIndex = 0;
  let visibleItems = [];
  let lastFocused = null;

  const getVisibleItems = () => Array.from(galleryItems).filter(item => !item.classList.contains('is-hidden'));

  const updateLightbox = () => {
    const item = visibleItems[currentIndex];
    if (!item) return;
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = item.dataset.caption || img.alt;
  };

  const openLightbox = (item) => {
    visibleItems = getVisibleItems();
    currentIndex = visibleItems.indexOf(item);
    if (currentIndex < 0) return;
    lastFocused = document.activeElement;
    updateLightbox();
    lightbox.classList.add('is-active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  const showPrev = () => { currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length; updateLightbox(); };
  const showNext = () => { currentIndex = (currentIndex + 1) % visibleItems.length; updateLightbox(); };

  galleryItems.forEach(item => item.addEventListener('click', () => openLightbox(item)));
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  /* ===== Formulário de contato =====
     Front-end apenas: valida e mostra confirmação.
     Para receber as mensagens de verdade, conecte a um serviço
     de e-mail/backend (ex.: Formspree, EmailJS, Netlify Forms ou API própria). */
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        feedback.textContent = 'Por favor, preencha os campos obrigatórios.';
        form.reportValidity();
        return;
      }
      const primeiroNome = document.getElementById('nome').value.trim().split(' ')[0];
      feedback.textContent = `Obrigada, ${primeiroNome}! Sua mensagem foi enviada — retorno em breve.`;
      form.reset();
    });
  }

});