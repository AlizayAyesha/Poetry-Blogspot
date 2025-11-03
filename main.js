$(document).ready(function () {
    // Toggle hamburger menu and toggle menu (mobile)
    $("#menuToggle").on('click', function () {
        $(this).toggleClass("active");
        $("#navbarList").toggleClass("active");
    });

    // Add an active class in <a> tag for menu items
    $(".navbar-list li a").on('click', function () {
        $(".navbar-list li a").removeClass("active");
        $(this).addClass("active");
        // close menu after selecting a link
        $("#menuToggle").removeClass('active');
        $("#navbarList").removeClass("active");
    });

    // Parallax effect on background image
    $(window).on("scroll", function() {
        var scrollTop = $(this).scrollTop();
        $(".Parallax").css('transform', 'translateY(' + -(scrollTop * 0.5) + 'px)');
    });
});

const poemForm = document.getElementById("poemForm");
const poetryWall = document.getElementById("poetryWall");

poemForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const category = document.getElementById("category").value;
  const tags = document.getElementById("tags").value.trim();
  const author = document.getElementById("author").value.trim() || "Anonymous";
  const text = document.getElementById("poemText").value.trim();

  if (!text) return;

  const card = document.createElement("div");
  card.classList.add("poem-card");
  card.innerHTML = `
    <blockquote>"${text}"</blockquote>
    <footer>– ${author}</footer>
    <div class="poem-meta">
      <span class="category">${category}</span>
      ${tags ? `<span class="tags">${tags.split(',').map(tag => tag.trim()).join(', ')}</span>` : ''}
    </div>
  `;

  poetryWall.prepend(card);

  poemForm.reset();
});

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);
themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  body.setAttribute('data-theme', newTheme);
  themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';

  // Save theme preference to localStorage
  localStorage.setItem('theme', newTheme);
});

// Language selector functionality
const languageSelector = document.getElementById('language-selector');
const currentLang = localStorage.getItem('language') || 'en';
languageSelector.value = currentLang;

// Simple translation object (expand as needed)
const translations = {
  en: {
    home: 'Home',
    about: 'About',
    poetry: 'Poetry',
    contact: 'Contact',
    profile: 'Profile',
    login: 'Login',
    welcome: 'Welcome to the Flask API Service!',
    add: 'Add',
    authorPlaceholder: 'Your name (optional)',
    poemPlaceholder: 'Write a short motivational line or poem'
  },
  es: {
    home: 'Inicio',
    about: 'Acerca de',
    poetry: 'Poesía',
    contact: 'Contacto',
    profile: 'Perfil',
    login: 'Iniciar sesión',
    welcome: '¡Bienvenido al Servicio de API de Flask!',
    add: 'Agregar',
    authorPlaceholder: 'Tu nombre (opcional)',
    poemPlaceholder: 'Escribe una línea o poema motivacional corto'
  },
  fr: {
    home: 'Accueil',
    about: 'À propos',
    poetry: 'Poésie',
    contact: 'Contact',
    profile: 'Profil',
    login: 'Connexion',
    welcome: 'Bienvenue dans le service API Flask!',
    add: 'Ajouter',
    authorPlaceholder: 'Votre nom (optionnel)',
    poemPlaceholder: 'Écrivez une courte ligne ou un poème motivant'
  }
};

function updateLanguage(lang) {
  const trans = translations[lang] || translations.en;

  // Update navigation
  document.querySelector('a[href="#"]').textContent = trans.home;
  document.querySelector('a[href="#about"]').textContent = trans.about;
  document.querySelector('a[href="#poetry"]').textContent = trans.poetry;
  document.querySelector('a[href="#contact"]').textContent = trans.contact;
  document.querySelector('a[href="profile.html"]').textContent = trans.profile;
  document.querySelector('a[href="auth.html"]').textContent = trans.login;

  // Update form placeholders
  document.getElementById('author').placeholder = trans.authorPlaceholder;
  document.getElementById('poemText').placeholder = trans.poemPlaceholder;
  document.querySelector('.poem-form button').textContent = trans.add;

  // Update headings
  document.querySelector('.content h2').textContent = 'Motivational Poetry';
  document.querySelector('.about-intro h2').textContent = 'About';
  document.querySelector('.about-intro .lead').textContent = 'A little wall for motivation — drop by to read or add a short poem or quote that inspires you.';
  document.querySelector('.contact-title').textContent = 'Get In Touch';
}

// Initialize language
updateLanguage(currentLang);

// Language selector event
languageSelector.addEventListener('change', (e) => {
  const selectedLang = e.target.value;
  localStorage.setItem('language', selectedLang);
  updateLanguage(selectedLang);
});
