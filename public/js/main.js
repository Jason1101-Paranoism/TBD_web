(() => {
  // ---------------------------------------------------------------------------
  // Mobile menu
  // ---------------------------------------------------------------------------
  const menu = document.getElementById('mobileMenu');
  if (menu) {
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
  }

  // ---------------------------------------------------------------------------
  // GA4 event tracking (v1.2 — Key Event / CTA 追蹤)
  //
  // Standard key events:
  //   click_line_cta, click_ig_cta, click_consultation_cta,
  //   view_service_page, view_article, scroll_75,
  //   download_resource, submit_contact_form
  //
  // 任一 CTA 可用 data-track-event="<event>" 明確指定要送的事件。
  // 沒有指定時，下方 script 會依舊有的 data-ga-event 或 href 自動推斷。
  // ---------------------------------------------------------------------------
  const DEBUG =
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1' ||
    new URLSearchParams(location.search).has('ga_debug');

  function track(eventName, params) {
    if (!eventName) return;
    if (typeof window.gtag !== 'function') {
      if (DEBUG) console.warn('[ga] gtag 未載入，略過事件：', eventName, params);
      return;
    }
    const payload = Object.assign({ page_path: location.pathname }, params || {});
    if (DEBUG) {
      payload.debug_mode = true;
      console.log('[ga]', eventName, payload);
    }
    window.gtag('event', eventName, payload);
  }
  // 對外曝露，方便其他 inline script 直接呼叫 window.tbdTrack(...)
  window.tbdTrack = track;

  const DOWNLOAD_RE = /\.(pdf|zip|docx?|xlsx?|pptx?|csv)(\?|#|$)/i;

  // 把被點擊的連結對應到標準 key event
  function resolveClickEvent(el, href) {
    // 1. 明確指定優先
    const explicit = el.getAttribute('data-track-event');
    if (explicit) return explicit;

    // 2. 舊有的細分屬性
    const legacy = el.getAttribute('data-ga-event') || '';
    if (legacy === 'click_line_footer') return 'click_line_cta';
    if (legacy.indexOf('click_ig_') === 0) return 'click_ig_cta';
    if (legacy.indexOf('click_line_') === 0) return 'click_consultation_cta';

    // 3. 依 href 自動推斷
    if (!href) return null;
    if (/instagram\.com/i.test(href)) return 'click_ig_cta';
    if (DOWNLOAD_RE.test(href)) return 'download_resource';
    if (/lin\.ee|line\.me/i.test(href)) {
      // 「預約策略諮詢」類 CTA 帶 utm_medium=cta / nav；純加好友連結則沒有
      return /utm_medium=(cta|nav)/i.test(href) ? 'click_consultation_cta' : 'click_line_cta';
    }
    return null;
  }

  document.addEventListener('click', (event) => {
    const target = event.target;
    const el = target && target.closest ? target.closest('a, [data-track-event]') : null;
    if (!el) return;
    const href = el.getAttribute('href') || '';
    const eventName = resolveClickEvent(el, href);
    if (!eventName) return;
    track(eventName, {
      link_url: href || undefined,
      link_text: (el.textContent || '').trim().slice(0, 100) || undefined,
      cta_id: el.getAttribute('data-ga-event') || undefined,
    });
  }, true);

  // ---------------------------------------------------------------------------
  // Page view：服務頁 / 文章頁
  // ---------------------------------------------------------------------------
  const path = location.pathname;
  if (/\/pages\/services(\.html|\/|$)/.test(path)) {
    track('view_service_page', { page_title: document.title });
  } else if (/\/pages\/resources\/[^/]+/.test(path)) {
    track('view_article', { page_title: document.title });
  }

  // ---------------------------------------------------------------------------
  // scroll_75：捲動超過 75% 觸發一次
  // ---------------------------------------------------------------------------
  let scrollFired = false;
  function onScroll() {
    if (scrollFired) return;
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    if (scrollable <= 0) return;
    const pct = ((window.scrollY || doc.scrollTop) / scrollable) * 100;
    if (pct >= 75) {
      scrollFired = true;
      window.removeEventListener('scroll', onScroll);
      track('scroll_75', { page_title: document.title });
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------------------------------------------------------------------------
  // submit_contact_form：表單送出（未來新增 <form> 時自動生效）
  // 可在不想追蹤的表單上加 data-no-track 來排除。
  // ---------------------------------------------------------------------------
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (form.hasAttribute('data-no-track')) return;
    track('submit_contact_form', {
      form_id: form.id || form.getAttribute('name') || undefined,
    });
  }, true);

  // ---------------------------------------------------------------------------
  // 進場淡入（scroll reveal）
  // 元素標 data-reveal / data-reveal-stagger，進入視窗時加 .is-visible。
  // 隱藏樣式只在 <html>.js-reveal 下生效（見 tbd-base.css），所以 no-JS 全顯示。
  // 尊重 prefers-reduced-motion：直接全部顯示、不做動畫。
  // ---------------------------------------------------------------------------
  const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
  if (revealEls.length) {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('js-reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
      revealEls.forEach((el) => io.observe(el));
    }
  }
})();
