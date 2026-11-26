// Полиркот — небольшие интерактивные мелочи. Без библиотек.
(function () {
  var root = document.documentElement;

  var themeButton = document.querySelector('.theme-btn');
  function syncThemeButton() {
    themeButton.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
  }
  syncThemeButton();
  themeButton.addEventListener('click', async function () {
    var nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    var illustration = new Image();
    illustration.src = nextTheme === 'dark' ? 'assets/img/polirkot-dark.webp' : 'assets/img/polirkot.webp';
    try { await illustration.decode(); } catch (e) {}
    savedTheme = nextTheme;
    applyTheme(savedTheme);
    syncThemeButton();
    try { localStorage.setItem('theme', savedTheme); } catch (e) {}
  });
  systemTheme.addEventListener('change', function (event) {
    if (savedTheme === 'light' || savedTheme === 'dark') return;
    applyTheme(event.matches ? 'dark' : 'light');
    syncThemeButton();
  });

  // Один проход блика по «стеклу» после загрузки шрифтов
  var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  ready.then(function () { requestAnimationFrame(function () { root.classList.add('is-loaded'); }); });

  // Граница у шапки после прокрутки
  var header = document.querySelector('.header');
  var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Мобильное меню
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  var firstLink = nav.querySelector('a');
  var setMenu = function (open) {
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) firstLink.focus();
  };
  btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
  header.querySelector('.logo').addEventListener('click', function () { setMenu(false); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (!nav.classList.contains('is-open')) return;
    if (e.key === 'Escape') { setMenu(false); btn.focus(); }
    if (e.key === 'Tab' && e.target === (e.shiftKey ? firstLink : btn)) {
      e.preventDefault();
      (e.shiftKey ? btn : firstLink).focus();
    }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });

  // Сравнение «до / после»
  document.querySelectorAll('.ba').forEach(function (ba) {
    var range = ba.querySelector('.ba__range');
    var update = function () { ba.style.setProperty('--pos', range.value + '%'); };
    range.addEventListener('input', update);
    update();
  });

  var reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    var blocks = document.querySelectorAll('[data-reveal]');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var block = entry.target;
        var sibling = block.previousElementSibling;
        var delay = 0;
        while (sibling && sibling.hasAttribute('data-reveal') && sibling.offsetTop === block.offsetTop) {
          delay = Math.min(delay + 55, 165);
          sibling = sibling.previousElementSibling;
        }
        block.style.setProperty('--reveal-delay', delay + 'ms');
        block.classList.replace('reveal-pending', 'reveal-enter');
        observer.unobserve(block);
      });
    });
    blocks.forEach(function (block) {
      if (block.getBoundingClientRect().top < window.innerHeight) return;
      block.classList.add('reveal-pending');
      observer.observe(block);
    });
    reducedMotion.addEventListener('change', function () {
      observer.disconnect();
      blocks.forEach(function (block) { block.classList.remove('reveal-pending', 'reveal-enter'); });
    }, { once: true });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
