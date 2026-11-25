// Полиркот — небольшие интерактивные мелочи. Без библиотек.
(function () {
  var root = document.documentElement;

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

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
