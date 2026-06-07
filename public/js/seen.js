/* TBD Growth Compass — 「看見」公開鉤子 (v1)
 * 第 0–4 階：鉤子 → 捕捉 → 被看懂(反射式+模板) → 交棒(LINE + 真實案例)
 * 純前端、無後端、無帳號。資料不儲存（深掘與儲存留給後端 app）。
 */
(function () {
  'use strict';

  var state = { title: '', origin: '', role: '', runway: '' };

  /* ---- GA：內部步驟事件（CTA 由 main.js 經 data-track-event 處理）---- */
  function track(event, params) {
    if (typeof window.gtag !== 'function') return;
    var payload = Object.assign({ page_path: location.pathname }, params || {});
    if (location.hostname === 'localhost' || location.search.indexOf('ga_debug=1') > -1) {
      payload.debug_mode = true;
      try { console.log('[ga]', event, payload); } catch (e) {}
    }
    window.gtag('event', event, payload);
  }

  /* ---- 步驟切換 ---- */
  function show(stepId) {
    var steps = document.querySelectorAll('.gc-step');
    for (var i = 0; i < steps.length; i++) steps[i].classList.remove('is-active');
    var el = document.getElementById(stepId);
    if (el) el.classList.add('is-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---- 單選 chip 群組 ---- */
  function wireChips(groupId, onPick) {
    var group = document.getElementById(groupId);
    if (!group) return;
    group.addEventListener('click', function (e) {
      var chip = e.target.closest('.gc-chip');
      if (!chip) return;
      var chips = group.querySelectorAll('.gc-chip');
      for (var i = 0; i < chips.length; i++) {
        chips[i].classList.remove('is-selected');
        chips[i].setAttribute('aria-checked', 'false');
      }
      chip.classList.add('is-selected');
      chip.setAttribute('aria-checked', 'true');
      onPick(chip.getAttribute('data-value'));
    });
  }

  /* ===========================================================
   *  反射式重述 + 模板（第 1 階「被看懂」的命門）
   *  原則：反射、不預測；只重述使用者的話 + 點出隱含能力 + 依跑道給方向。
   * =========================================================== */

  var ORIGIN_LINE = {
    assigned: '你說這是「老師或家長要你做」的——但你接下來做的，已經不只是把事情交差而已。',
    self: '你是自己想做的。這件事從一開始就帶著你的選擇，這比你以為的更有份量。',
    friends: '你是被朋友拉進來的——但會把它放在心上、認真做到最後的，是你。',
    forgot: '你已經想不太起來當初為什麼開始了。這很常見，通常代表它早就變成你會自然去做的事。'
  };

  // 由 role / title 偵測一個「可講出口」的能力標籤（偵測不到就不硬掰）
  var CAPABILITIES = [
    [/(規劃|策劃|安排|排了|排程|計畫|計劃|籌備|統籌)/, '從零規劃並執行一件事'],
    [/(程式|寫\s*code|coding|開發|架站|網站|網頁|app|程式碼|系統)/i, '把點子做成真的能跑的東西'],
    [/(設計|排版|美編|繪圖|視覺|海報|logo|插畫)/i, '把想法變成看得到的設計'],
    [/(帶|領導|管理|帶領|主辦|負責|召集|幹部|社長|隊長|組長)/, '帶人，並把責任扛起來'],
    [/(教|教學|講解|分享|帶課|家教|授課)/, '把複雜的事講到別人聽得懂'],
    [/(拍|剪|影片|攝影|剪輯|錄製|vlog)/i, '用影像把事情說出來'],
    [/(訪問|採訪|訪談|田調|田野)/, '挖出別人故事的能力'],
    [/(分析|數據|統計|資料|問卷|量化)/, '用資料把問題看清楚'],
    [/(粉絲|觸及|流量|經營|成長了|追蹤|互動率|按讚|曝光)/, '把內容做出可以衡量的成長'],
    [/(比賽|競賽|參賽|獲獎|得獎|名次|入圍|奪)/, '在壓力和期限下把成果做出來'],
    [/(研究|文獻|論文|實驗|探究)/, '研究並驗證一個問題'],
    [/(募款|義賣|擺攤|銷售|販售|商品|定價|營收)/, '把東西推到真實的人面前'],
    [/(翻譯|口譯|筆譯)/, '跨語言把意思精準傳遞'],
    [/(志工|服務學習|偏鄉|關懷|陪伴|長照)/, '把在乎的事化成具體行動'],
    [/(企劃|活動|策展|展覽|園遊會|營隊)/, '把一個活動從無到有辦起來']
  ];

  function detectCapability(text) {
    for (var i = 0; i < CAPABILITIES.length; i++) {
      if (CAPABILITIES[i][0].test(text)) return CAPABILITIES[i][1];
    }
    return '';
  }

  var BRIDGE = {
    far: [
      { t: '而且你還有時間。下一步，與其再多參加一件不一樣的事，不如把這一件 ' },
      { t: '做得更深、留下能拿給別人看的東西', e: true },
      { t: '——一年後回頭看，這很可能就是你主線的起點。' }
    ],
    soon: [
      { t: '接下來這一年是關鍵。你需要的不一定是再多累積，而是開始 ' },
      { t: '挑出哪幾件最像你、把它們串成一條線', e: true },
      { t: '。' }
    ],
    now: [
      { t: '你已經有可以拿出來講的東西了。現在真正的關卡不是再多做一件，而是 ' },
      { t: '怎麼把它講成一個讓人記得住的故事', e: true },
      { t: '——這恰好是最容易被低估、也最需要有人幫你的部分。' }
    ]
  };

  // 回傳「段落陣列」；段落＝segment 陣列；segment＝{t,文字}＋可選 q(引述/重點色) / e(粗體)
  function buildReflection(s) {
    var paras = [];

    // 1) origin 重述
    paras.push([{ t: ORIGIN_LINE[s.origin] || ORIGIN_LINE.self }]);

    // 2) 重述 role（引用使用者原話）＋ 能力標籤
    var roleSeg = [
      { t: '你寫的不是「參加過」，而是具體做了：' },
      { t: '「' + s.role.trim() + '」', q: true },
      { t: '。' }
    ];
    paras.push(roleSeg);

    var cap = detectCapability(s.role + ' ' + s.title);
    if (cap) {
      paras.push([
        { t: '把這句話翻成大人的語言，這背後其實是 ' },
        { t: cap, e: true },
        { t: ' 的能力——只是平常沒人幫你這樣命名而已。' }
      ]);
    } else {
      paras.push([
        { t: '願意把「實際做了什麼」講得這麼具體，本身就是多數人做不到的事——教授和面試官想看到的，正是 ' },
        { t: '這種具體', e: true },
        { t: '。' }
      ]);
    }

    // 3) 依跑道給方向（兩種模式）
    paras.push(BRIDGE[s.runway] || BRIDGE.soon);

    return paras;
  }

  function renderReflection(s) {
    var card = document.getElementById('gc-seen-card');
    if (!card) return;
    card.textContent = '';
    var paras = buildReflection(s);
    for (var i = 0; i < paras.length; i++) {
      var p = document.createElement('p');
      var segs = paras[i];
      for (var j = 0; j < segs.length; j++) {
        var seg = segs[j];
        if (seg.q || seg.e) {
          var span = document.createElement('span');
          span.className = seg.q ? 'gc-quote' : 'gc-emph';
          span.textContent = seg.t; // 使用者文字一律用 textContent，安全
          p.appendChild(span);
        } else {
          p.appendChild(document.createTextNode(seg.t));
        }
      }
      card.appendChild(p);
    }
  }

  /* ---- 交棒原料：把使用者的回答整理成可貼進 LINE 的摘要 ---- */
  var ORIGIN_TEXT = {
    assigned: '老師或家長要我做', self: '自己想做的',
    friends: '朋友找我一起', forgot: '已經忘了當初為什麼'
  };
  var RUNWAY_TEXT = { far: '還很久', soon: '一年內', now: '就在眼前' };

  function buildStorySummary(s) {
    return [
      '嗨，我在 TBD 的「看見」填了我的一段經歷，想聊聊怎麼把它說清楚：',
      '',
      '・做過的事：' + s.title,
      '・當初為什麼做：' + (ORIGIN_TEXT[s.origin] || ''),
      '・我實際做了：' + s.role,
      '・距離申請：' + (RUNWAY_TEXT[s.runway] || ''),
      '',
      '想知道這段可以怎麼呈現／往哪走。'
    ].join('\n');
  }

  function onCopied() {
    var btn = document.getElementById('gc-copy');
    var hint = document.getElementById('gc-copy-hint');
    if (btn) btn.textContent = '已複製 ✓';
    if (hint) hint.textContent = '打開 LINE 後，直接貼上就好。';
    track('gc_copy_story', { gc_runway: state.runway });
  }

  function fallbackCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      onCopied();
    } catch (e) {
      var hint = document.getElementById('gc-copy-hint');
      if (hint) { hint.style.color = '#c0392b'; hint.textContent = '複製失敗，請手動選取文字。'; }
    }
  }

  function copyStory() {
    var text = buildStorySummary(state);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onCopied, function () { fallbackCopy(text); });
    } else {
      fallbackCopy(text);
    }
  }

  /* ---- 第 4 階：依跑道調整交棒語氣（導航 vs 呈現）---- */
  function renderCta(s) {
    var h2 = document.getElementById('gc-cta-h2');
    var sub = document.getElementById('gc-cta-sub');
    if (!h2 || !sub) return;
    if (s.runway === 'far') {
      h2.textContent = '你正在長成某個樣子——只是現在還看不清楚。';
      sub.textContent = '你還有時間，這是你的優勢。把這條線顧好，會比多跑幾場活動更值得。想知道它可以往哪走，我們可以一起看看。';
    } else if (s.runway === 'now') {
      h2.textContent = '你不是沒有故事，只是還沒被講出來。';
      sub.textContent = '申請就在眼前，你缺的不是經歷，是把它說清楚、串成一條線。這一段，正是 TBD 顧問在做的事。';
    } else {
      h2.textContent = '你不是沒有故事，只是還沒被串起來。';
      sub.textContent = '接下來這一年，把對的幾件事挑出來、連成一條主線，會決定別人怎麼看懂你。這一段，我們可以陪你。';
    }
  }

  /* ---- 驗證 ---- */
  function validate() {
    var err = document.getElementById('gc-error');
    state.title = document.getElementById('gc-title').value.trim();
    state.role = document.getElementById('gc-role').value.trim();
    if (!state.title) { err.textContent = '先用一句話說說這是什麼事吧。'; return false; }
    if (!state.origin) { err.textContent = '選一個：當初為什麼會去做？'; return false; }
    if (state.role.length < 4) { err.textContent = '多寫一點「你實際做了哪部分」，我才看得懂你。'; return false; }
    if (!state.runway) { err.textContent = '最後一個：距離申請大概多久？'; return false; }
    err.textContent = '';
    return true;
  }

  /* ---- 綁定 ---- */
  document.addEventListener('DOMContentLoaded', function () {
    wireChips('gc-origin', function (v) { state.origin = v; });
    wireChips('gc-runway', function (v) { state.runway = v; });

    document.getElementById('gc-start').addEventListener('click', function () {
      track('gc_start');
      show('gc-step-capture');
      var t = document.getElementById('gc-title');
      if (t) t.focus();
    });

    document.getElementById('gc-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;
      track('gc_capture_submit', { gc_origin: state.origin, gc_runway: state.runway });
      renderReflection(state);
      renderCta(state);
      show('gc-step-seen');
    });

    document.getElementById('gc-seen-continue').addEventListener('click', function () {
      track('gc_seen_continue');
      show('gc-step-cta');
    });

    document.getElementById('gc-copy').addEventListener('click', copyStory);

    function again() {
      track('gc_again');
      document.getElementById('gc-form').reset();
      state = { title: '', origin: '', role: '', runway: '' };
      var sel = document.querySelectorAll('.gc-chip.is-selected');
      for (var i = 0; i < sel.length; i++) {
        sel[i].classList.remove('is-selected');
        sel[i].setAttribute('aria-checked', 'false');
      }
      document.getElementById('gc-error').textContent = '';
      var copyBtn = document.getElementById('gc-copy');
      var copyHint = document.getElementById('gc-copy-hint');
      if (copyBtn) copyBtn.textContent = '把我的故事複製起來';
      if (copyHint) { copyHint.textContent = ''; copyHint.style.color = ''; }
      show('gc-step-capture');
      document.getElementById('gc-title').focus();
    }
    document.getElementById('gc-again').addEventListener('click', again);
    document.getElementById('gc-again-2').addEventListener('click', again);

    track('gc_hook_view');
  });
})();
