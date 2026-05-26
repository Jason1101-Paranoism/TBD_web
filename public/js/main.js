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

(function() {
  document.querySelectorAll('[data-ga-event]').forEach(function(el) {
    el.addEventListener('click', function() {
      if (typeof window.gtag === 'function') {
        window.gtag('event', el.dataset.gaEvent, { event_category: 'cta' });
      }
    });
  });
})();
