(() => {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  const close = () => { menu.open = false; };
  menu.querySelectorAll('[data-close-menu]').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      close();
    });
  });
  const backdrop = menu.querySelector('[data-menu-backdrop]');
  if (backdrop) backdrop.addEventListener('click', close);
  menu.querySelectorAll('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', close);
  });
})();
