document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  const navLinks = Array.from(document.querySelectorAll('.site-nav a'));

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

  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }
});

const dropdown = document.querySelector(".nav-dropdown");
const toggle = dropdown.querySelector(".dropdown-toggle");

toggle.addEventListener("click", () => {
    if (window.innerWidth <= 992) {
        dropdown.classList.toggle("active");
    }
});
