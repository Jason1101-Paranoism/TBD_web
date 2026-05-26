(function () {
  'use strict';

  /* ── State ── */
  var state = {
    tab: 'home',
    mockupTab: 'projects',
    step: 0,
    tool: 'notion',
    caseField: 'engineering',
    faq: null,
  };

  /* ── Toast ── */
  function showToast(msg) {
    var el = document.getElementById('pg-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.add('hidden'); }, 2600);
  }

  /* ── Copy to clipboard ── */
  function copyText(text, msg) {
    var done = function () { showToast(msg || '已複製！'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, cb) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (_) {}
    document.body.removeChild(ta);
    cb();
  }

  /* ── Tab switching ── */
  function switchTab(id) {
    document.querySelectorAll('.pg-panel').forEach(function (p) { p.classList.add('hidden'); });
    var panel = document.getElementById('pg-tab-' + id);
    if (panel) panel.classList.remove('hidden');
    document.querySelectorAll('.pg-nav-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.tab === id);
    });
    state.tab = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── Mockup tab ── */
  function switchMockupTab(tab) {
    document.querySelectorAll('.pg-mockup-panel').forEach(function (p) { p.classList.add('hidden'); });
    var panel = document.getElementById('pg-mockup-' + tab);
    if (panel) panel.classList.remove('hidden');
    document.querySelectorAll('.pg-mockup-btn').forEach(function (btn) {
      var active = btn.dataset.mockupTab === tab;
      btn.classList.toggle('border-b-2', active);
      btn.classList.toggle('border-[#1A5D94]', active);
      btn.classList.toggle('text-[#1A5D94]', active);
      btn.classList.toggle('text-[#767995]', !active);
    });
    state.mockupTab = tab;
  }

  /* ── Step navigation ── */
  function setStep(index) {
    document.querySelectorAll('.pg-step-btn').forEach(function (btn, i) {
      var active = i === index;
      btn.classList.toggle('bg-[#1A5D94]', active);
      btn.classList.toggle('text-white', active);
      btn.classList.toggle('bg-white', !active);
      btn.classList.toggle('text-[#767995]', !active);
      btn.classList.toggle('border', !active);
      btn.classList.toggle('border-[#D0CEDB]/60', !active);
    });
    document.querySelectorAll('.pg-step-panel').forEach(function (p, i) {
      p.classList.toggle('hidden', i !== index);
    });
    state.step = index;
  }

  /* ── Tool selection ── */
  function selectTool(key) {
    document.querySelectorAll('.pg-tool-btn').forEach(function (btn) {
      var active = btn.dataset.tool === key;
      btn.classList.toggle('bg-[#1A5D94]', active);
      btn.classList.toggle('text-white', active);
      btn.classList.toggle('bg-white', !active);
      btn.classList.toggle('border', !active);
      btn.classList.toggle('border-[#D0CEDB]/60', !active);
      btn.classList.toggle('text-[#767995]', !active);
    });
    document.querySelectorAll('.pg-tool-panel').forEach(function (p) {
      p.classList.toggle('hidden', p.dataset.tool !== key);
    });
    state.tool = key;
  }

  /* ── Case selection ── */
  function selectCase(key) {
    document.querySelectorAll('.pg-case-btn').forEach(function (btn) {
      var active = btn.dataset.case === key;
      btn.classList.toggle('bg-[#1A5D94]', active);
      btn.classList.toggle('text-white', active);
      btn.classList.toggle('bg-white', !active);
      btn.classList.toggle('border', !active);
      btn.classList.toggle('border-[#D0CEDB]/60', !active);
      btn.classList.toggle('text-[#767995]', !active);
    });
    document.querySelectorAll('.pg-case-panel').forEach(function (p) {
      p.classList.toggle('hidden', p.dataset.case !== key);
    });
    state.caseField = key;
  }

  /* ── FAQ accordion ── */
  function toggleFaq(index) {
    var newOpen = state.faq === index ? null : index;
    document.querySelectorAll('.pg-faq-body').forEach(function (body, i) {
      body.classList.toggle('hidden', i !== newOpen);
    });
    document.querySelectorAll('.pg-faq-toggle').forEach(function (btn, i) {
      btn.textContent = i === newOpen ? '−' : '+';
    });
    state.faq = newOpen;
  }

  /* ── Prompt generator helpers ── */
  function val(id) { var el = document.getElementById(id); return el ? el.value : ''; }

  function getStarStructure() {
    var name = val('pg-name') || '學生';
    var line = val('pg-line') || '尚未填寫';
    var pain = val('pg-pain') || '請填寫此專案遇到的問題、需求或背景。';
    var action = val('pg-action') || '請填寫你實際做了什麼、用了哪些方法或工具。';
    var result = val('pg-result') || '請填寫成果數據、作品連結、回饋或可驗證證據。';
    return '【Portfolio 專案 STAR/SARI 結構】\n\n學生姓名：' + name + '\n個人主線：' + line +
      '\n\nS｜Situation 問題情境\n' + pain +
      '\n\nA｜Action 採取行動\n' + action +
      '\n\nR｜Result 具體成果\n' + result +
      '\n\nI｜Insight 反思遷移\n請補充：這段經歷讓我理解到什麼？下次我會如何改進？它如何連結到我想申請的科系或學群？';
  }

  function getPolishPrompt() {
    var name = val('pg-name') || '學生';
    var line = val('pg-line') || '尚未填寫';
    var pain = val('pg-pain');
    var action = val('pg-action');
    var result = val('pg-result');
    return '你是一位專業升學顧問與大學面試教練。請根據以下學生素材，將內容潤飾成一段可放入高中生 Portfolio 個人網站的專業經歷敘述。\n\n學生姓名：' + name + '\n個人主線：' + line +
      '\n遭遇的痛點 Situation：' + pain +
      '\n採取的行動 Action：' + action +
      '\n具體成果 Result：' + result +
      '\n\n請依照 STAR / SARI 敘事邏輯重寫：\n1. 使用第一人稱「我」。\n2. 字數約 200–300 字。\n3. 語氣自信、真實、有高中生自主學習感。\n4. 避免過度浮誇、官腔、AI 味。\n5. 凸顯「問題意識 → 行動方法 → 成果證據 → 反思成長」。\n6. 可使用簡短段落或條列。\n7. 不要輸出前言，不要說「以下是」。';
  }

  function updateStarDisplay() {
    var el = document.getElementById('pg-star-display');
    if (el) el.textContent = getStarStructure();
  }

  function generatePrompt() {
    if (!val('pg-pain') || !val('pg-action') || !val('pg-result')) {
      showToast('請先填寫痛點、行動與成果。');
      return;
    }
    var container = document.getElementById('pg-generated-prompt-container');
    var display = document.getElementById('pg-generated-prompt-display');
    if (display) display.textContent = getPolishPrompt();
    if (container) container.classList.remove('hidden');
    showToast('Prompt 已產生，可以複製使用。');
  }

  /* ── Init ── */
  function init() {
    /* Sidebar tab buttons */
    document.querySelectorAll('.pg-nav-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { switchTab(btn.dataset.tab); });
    });

    /* Mockup sub-tabs */
    document.querySelectorAll('.pg-mockup-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { switchMockupTab(btn.dataset.mockupTab); });
    });

    /* Step buttons */
    document.querySelectorAll('.pg-step-btn').forEach(function (btn, i) {
      btn.addEventListener('click', function () { setStep(i); });
    });

    /* Tool buttons */
    document.querySelectorAll('.pg-tool-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { selectTool(btn.dataset.tool); });
    });

    /* Case buttons */
    document.querySelectorAll('.pg-case-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { selectCase(btn.dataset.case); });
    });

    /* FAQ items */
    document.querySelectorAll('.pg-faq-item').forEach(function (item, i) {
      var btn = item.querySelector('.pg-faq-btn');
      if (btn) btn.addEventListener('click', function () { toggleFaq(i); });
    });

    /* Prompt generator live update */
    ['pg-name', 'pg-line', 'pg-pain', 'pg-action', 'pg-result'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', updateStarDisplay);
    });

    /* Copy STAR button */
    var copyStarBtn = document.getElementById('pg-copy-star-btn');
    if (copyStarBtn) {
      copyStarBtn.addEventListener('click', function () {
        copyText(document.getElementById('pg-star-display').textContent, 'STAR 結構已複製！');
      });
    }

    /* Generate prompt button */
    var genBtn = document.getElementById('pg-generate-btn');
    if (genBtn) genBtn.addEventListener('click', generatePrompt);

    /* Copy generated prompt button */
    var copyGenBtn = document.getElementById('pg-copy-generated-btn');
    if (copyGenBtn) {
      copyGenBtn.addEventListener('click', function () {
        copyText(document.getElementById('pg-generated-prompt-display').textContent, 'Prompt 已複製！');
      });
    }

    /* Copy buttons referencing an element by ID */
    document.querySelectorAll('[data-copy-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var el = document.getElementById(btn.dataset.copyId);
        if (el) copyText(el.textContent, btn.dataset.copyMsg || '已複製！');
      });
    });

    /* Inline copy-text buttons */
    document.querySelectorAll('[data-copy-text]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        copyText(btn.dataset.copyText, btn.dataset.copyMsg || '已複製！');
      });
    });

    /* Set initial states */
    switchTab('home');
    switchMockupTab('projects');
    setStep(0);
    selectTool('notion');
    selectCase('engineering');
    updateStarDisplay();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
