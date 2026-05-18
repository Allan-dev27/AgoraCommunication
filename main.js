// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
const scrollProgress = document.getElementById('scrollProgress');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
  scrollProgress.setAttribute('aria-valuenow', Math.round(pct));
}
window.addEventListener('scroll', updateProgress, { passive: true });

// ============================================================
// NAV SCROLL HIGHLIGHT + SHADOW ON SCROLL
// ============================================================
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
const mainNav   = document.querySelector('nav:not(.mobile-menu)');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) current = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  // Ombre nav au scroll
  mainNav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ============================================================
// BURGER MENU
// ============================================================
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

// ============================================================
// REVEAL ON SCROLL
// ============================================================
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ============================================================
// COMPTEUR ANIMÉ (hero stats)
// ============================================================
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '+';
  const duration = 1800;
  const step = 16;
  const steps = Math.round(duration / step);
  let current = 0;
  const inc = target / steps;
  const timer = setInterval(() => {
    current += inc;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + (Math.floor(current) < target ? '' : suffix);
    }
  }, step);
}
// Observer les compteurs
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      // Vérifier prefers-reduced-motion
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        e.target.textContent = e.target.dataset.target + '+';
      } else {
        animateCounter(e.target);
      }
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ============================================================
// FORMULAIRE CONTACT (Formspree)
// ============================================================
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

// Réinitialiser la bordure rouge à la saisie
form.querySelectorAll('[required]').forEach(f => {
  f.addEventListener('input', () => { f.style.borderColor = ''; });
});

// ============================================================
// FORMULAIRE NEWSLETTER (footer)
// ============================================================
const newsletterForm   = document.getElementById('newsletterForm');
const newsletterStatus = document.getElementById('newsletterStatus');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', async e => {
    e.preventDefault();
    const emailEl = newsletterForm.querySelector('input[type="email"]');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      newsletterStatus.textContent = '⚠ Adresse email invalide.';
      newsletterStatus.style.color = '#e07b5a';
      return;
    }
    newsletterStatus.textContent = 'Envoi…';
    newsletterStatus.style.color = 'rgba(255,255,255,0.45)';
    // Ici connecter votre service (Mailchimp, Brevo…)
    await new Promise(r => setTimeout(r, 800));
    newsletterStatus.textContent = '✓ Inscription enregistrée !';
    newsletterStatus.style.color = '#8BC34A';
    newsletterForm.reset();
  });
}

// ============================================================
// BOUTON RETOUR EN HAUT
// ============================================================
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ============================================================
// COOKIE BANNER
// ============================================================
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

// ============================================================
// FILTRES PORTFOLIO
// ============================================================
const filterBtns     = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    portfolioCards.forEach(card => {
      const cats  = card.dataset.cat || '';
      const match = filter === 'all' || cats.includes(filter);
      if (match) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ============================================================
// ACCORDÉON FAQ
// ============================================================
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-question').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      btn.nextElementSibling.classList.add('open');
    }
  });
});

// ============================================================
// DARK MODE TOGGLE (bureau + mobile)
// ============================================================
const themeToggle       = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const html = document.documentElement;

function applyTheme(dark) {
  html.setAttribute('data-theme', dark ? 'dark' : '');
  const icon = dark ? '☀️' : '🌙';
  const label = dark ? 'Passer en mode clair' : 'Passer en mode sombre';
  [themeToggle, themeToggleMobile].forEach(btn => {
    if (btn) { btn.textContent = icon; btn.setAttribute('aria-label', label); }
  });
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  // Mettre à jour theme-color meta
  document.querySelector('meta[name="theme-color"][media*="light"]')
    ?.setAttribute('content', dark ? '#0d0c1a' : '#3C3489');
}

const saved      = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(saved ? saved === 'dark' : prefersDark);

[themeToggle, themeToggleMobile].forEach(btn => {
  btn?.addEventListener('click', () => {
    applyTheme(html.getAttribute('data-theme') !== 'dark');
  });
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('theme')) applyTheme(e.matches);
});

