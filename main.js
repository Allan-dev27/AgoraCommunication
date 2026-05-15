// NAV SCROLL HIGHLIGHT
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) current = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}, { passive: true });

// BURGER MENU
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
function toggleMenu(open) {
  burgerBtn.classList.toggle('open', open);
  mobileMenu.classList.toggle('open', open);
  burgerBtn.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
burgerBtn.addEventListener('click', () => toggleMenu(!mobileMenu.classList.contains('open')));
mobileMenu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => toggleMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

// REVEAL ON SCROLL
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// FORMULAIRE FORMSPREE
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('formSubmit');
const statusEl  = document.getElementById('formStatus');

form.addEventListener('submit', async function(e) {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll('[required]').forEach(f => {
    const ok = f.value.trim() !== '' && (f.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
    f.style.borderColor = ok ? '' : '#c62828';
    if (!ok) valid = false;
  });
  if (!valid) { showStatus('error', '⚠ Veuillez remplir tous les champs obligatoires.'); return; }

  submitBtn.textContent = 'Envoi en cours…';
  submitBtn.disabled = true;
  statusEl.className = 'form-status';
  statusEl.style.display = 'none';

  try {
    const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
    if (res.ok) {
      showStatus('success', '✓ Message envoyé ! Nous vous répondrons très bientôt.');
      form.reset();
    } else {
      const json = await res.json().catch(() => ({}));
      showStatus('error', '✗ ' + (json.errors ? json.errors.map(e => e.message).join(', ') : 'Une erreur est survenue.'));
    }
  } catch {
    showStatus('error', "✗ Impossible d'envoyer le message. Vérifiez votre connexion.");
  } finally {
    submitBtn.textContent = 'Envoyer le message →';
    submitBtn.disabled = false;
  }
});

function showStatus(type, msg) { statusEl.className = 'form-status ' + type; statusEl.textContent = msg; }

// BOUTON RETOUR EN HAUT
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// COOKIE BANNER
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
const cookieRefuse = document.getElementById('cookieRefuse');

function hideCookie() {
  cookieBanner.classList.remove('visible');
  cookieBanner.addEventListener('transitionend', () => cookieBanner.remove(), { once: true });
}

if (!localStorage.getItem('cookieChoice')) {
  setTimeout(() => cookieBanner.classList.add('visible'), 1200);
}

cookieAccept.addEventListener('click', () => {
  localStorage.setItem('cookieChoice', 'accepted');
  hideCookie();
  // Ici : initialiser Google Analytics ou Matomo si accepté
});

cookieRefuse.addEventListener('click', () => {
  localStorage.setItem('cookieChoice', 'refused');
  hideCookie();
});

// FILTRES PORTFOLIO
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    portfolioCards.forEach(card => {
      const cats = card.dataset.cat || '';
      const match = filter === 'all' || cats.includes(filter);
      card.classList.toggle('hidden', !match);
    });
  });
});

// ACCORDÉON FAQ
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    // Fermer tous les autres
    document.querySelectorAll('.faq-question').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });
    // Ouvrir celui-ci si ce n'était pas déjà ouvert
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      btn.nextElementSibling.classList.add('open');
    }
  });
});

// DARK MODE TOGGLE
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function applyTheme(dark) {
  html.setAttribute('data-theme', dark ? 'dark' : '');
  themeToggle.textContent = dark ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', dark ? 'Passer en mode clair' : 'Passer en mode sombre');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

// Lire la préférence sauvegardée, sinon détecter le système
const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(saved ? saved === 'dark' : prefersDark);

themeToggle.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') !== 'dark');
});

// Suivre les changements système si pas de préférence sauvegardée
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('theme')) applyTheme(e.matches);
});
