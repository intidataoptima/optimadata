document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
  const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open');
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (nav) nav.classList.remove('is-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  });

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector('.dropdown-toggle');
    if (!trigger) return;

    trigger.addEventListener('click', (event) => {
      event.preventDefault();

      if (window.innerWidth <= 992) {
        dropdown.classList.toggle('active');
        return;
      }

      const isOpen = dropdown.classList.contains('is-open');
      dropdowns.forEach((item) => {
        item.classList.remove('is-open');
        item.classList.remove('is-manual');
      });

      if (!isOpen) {
        dropdown.classList.add('is-open');
        dropdown.classList.add('is-manual');
      }
    });

    dropdown.addEventListener('mouseenter', () => {
      if (window.innerWidth > 992) {
        dropdown.classList.add('is-open');
        dropdown.classList.remove('is-manual');
      }
    });

    dropdown.addEventListener('mouseleave', () => {
      if (window.innerWidth > 992 && !dropdown.classList.contains('is-manual')) {
        dropdown.classList.remove('is-open');
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-dropdown')) {
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove('is-open');
        dropdown.classList.remove('is-manual');
      });
    }
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          link.classList.toggle('is-active', href === `#${id}`);
        });
      }
    });
  }, { threshold: 0.35, rootMargin: '-20% 0px -45% 0px' });

  document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));

  const carouselTrack = document.querySelector('.hero-carousel-track');
  const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));

  if (carouselTrack && heroSlides.length > 1) {
    let activeSlide = heroSlides.findIndex((slide) => slide.classList.contains('is-active'));
    if (activeSlide === -1) activeSlide = 0;

    const showSlide = (index) => {
      heroSlides.forEach((slide, idx) => {
        const isActive = idx === index;
        slide.classList.toggle('is-active', isActive);
        slide.querySelectorAll('.reveal').forEach((el) => {
          el.classList.toggle('is-visible', isActive);
        });
      });
    };

    const moveNext = () => {
      activeSlide = (activeSlide + 1) % heroSlides.length;
      showSlide(activeSlide);
    };

    let carouselTimer = setInterval(moveNext, 5000);

    carouselTrack.addEventListener('mouseenter', () => {
      clearInterval(carouselTimer);
    });

    carouselTrack.addEventListener('mouseleave', () => {
      carouselTimer = setInterval(moveNext, 5000);
    });
  }

  const heroSlider = document.querySelector('.hero-slider');
  const heroFullSlides = Array.from(document.querySelectorAll('.hero-slide-full'));

  if (heroSlider && heroFullSlides.length > 1) {
    let activeHeroSlide = heroFullSlides.findIndex((slide) => slide.classList.contains('is-active'));
    if (activeHeroSlide === -1) activeHeroSlide = 0;

    

    const moveNextHero = () => {
      activeHeroSlide = (activeHeroSlide + 1) % heroFullSlides.length;
      showHeroSlide(activeHeroSlide);
    };

    const movePrevHero = () => {
      activeHeroSlide = (activeHeroSlide - 1 + heroFullSlides.length) % heroFullSlides.length;
      showHeroSlide(activeHeroSlide);
    };

    // restore autoplay for hero slider
    let heroTimer = setInterval(moveNextHero, 5000);

    heroSlider.addEventListener('mouseenter', () => {
      clearInterval(heroTimer);
    });

    heroSlider.addEventListener('mouseleave', () => {
      heroTimer = setInterval(moveNextHero, 5000);
    });

    // create a dedicated promo panel shell and sync it with hero slides
    const promoShellExists = document.querySelector('.promo-shell');
    let promoShell = promoShellExists;
    const panelContents = heroFullSlides.map((slide) => {
      const panel = slide.querySelector('.hero-panel');
      return panel ? panel.innerHTML : '';
    });

    if (!promoShell) {
      promoShell = document.createElement('div');
      promoShell.className = 'promo-shell';
      // place promo shell inside heroSlider so it aligns with layout
      heroSlider.appendChild(promoShell);
    }

    const showPromo = (index) => {
      promoShell.innerHTML = panelContents[index] || '';
    };

    // initialize promo with current active slide
    showPromo(activeHeroSlide);

    // redefine showHeroSlide to also update promo shell
    const showHeroSlide = (index) => {
      heroFullSlides.forEach((slide, idx) => {
        const isActive = idx === index;
        slide.classList.toggle('is-active', isActive);
        slide.querySelectorAll('.reveal').forEach((el) => {
          el.classList.toggle('is-visible', isActive);
        });
      });
      showPromo(index);
    };
  }

  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }
});

