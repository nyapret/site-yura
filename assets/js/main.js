const nav = document.querySelector('nav');
const menu = document.querySelector('.menu');
function toggleMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
}
menu.addEventListener('click', () => toggleMenu(!nav.classList.contains('open')));
document.addEventListener('click', event => {
  if (!menu.contains(event.target)) toggleMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    toggleMenu(false);
    menu.focus();
  }
});

const categories = document.querySelectorAll('.filters button');
for (const button of categories) {
  button.addEventListener('click', () => {
    for (const item of categories) {
      const selected = item === button;
      item.setAttribute('aria-pressed', String(selected));
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    }
  });
}
for (const range of document.querySelectorAll('.compare input')) {
  range.addEventListener('input', () => range.parentElement.style.setProperty('--pos', range.value + '%'));
}

// После подключения Метрики укажите ID счётчика.
const counterId = null;
function reachGoal(name) {
  if (counterId && typeof ym === 'function') ym(counterId, 'reachGoal', name);
}
document.addEventListener('click', event => {
  const channel = event.target.closest('[data-goal]');
  if (channel) reachGoal(channel.dataset.goal);
});
document.getElementById('contact-form').addEventListener('submit', () => reachGoal('form_submit'));
