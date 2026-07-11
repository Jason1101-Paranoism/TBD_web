/* grad-path-quiz.js — 研究所推甄 vs 考試 互動測驗（獨立 vanilla JS，無框架）
 * 計分：每個選項 +1 到 push（推甄）/ exam（考試）/ neutral（中立）三維度之一。
 * 判定：push-exam>2 → 推甄；exam-push>2 → 考試；否則（差距 ≤2）→ 雙軌並行。
 * card 上的 data-screen（intro / q0..q9 / result）供 verify.mjs 煙霧測試判讀。 */
(function () {
  'use strict';

  var P = 'push', E = 'exam', N = 'neutral';

  var QUESTIONS = [
    { q: '又到了學期末，你的成績單通常長什麼樣子呢？', e: '🎓', opts: [
      { t: '幾乎科科 A+，是教授眼中的乖寶寶！', d: P },
      { t: '成績普通，有幾科特別好，但也有幾科低空飛過…', d: E },
      { t: '成績是什麼？能吃嗎？我都在玩社團／打工！', d: E },
      { t: '雖然大一二有點混，但大三成績有顯著進步！', d: P },
    ]},
    { q: '大學期間，你有參與過專題研究、實驗室計畫或相關實習嗎？', e: '🔬', opts: [
      { t: '有喔！我可是實驗室的得力助手，還參加過研討會！', d: P },
      { t: '有做過專題，但只是跟著學長姐打雜，沒什麼突出成果。', d: N },
      { t: '完全沒有，我連教授的辦公室在哪都不知道。', d: E },
      { t: '雖然沒進實驗室，但我有去企業實習，累積了實務經驗！', d: P },
    ]},
    { q: '你要向一群陌生人介紹自己和你的夢想，你的感覺是？', e: '🎤', opts: [
      { t: '興奮！我最喜歡分享想法了，包準讓大家印象深刻！', d: P },
      { t: '有點緊張，但如果有準備稿子，應該可以說得還算順暢。', d: N },
      { t: '拜託不要！我最怕上台說話，可不可以只看筆試成績？', d: E },
      { t: '我可以把經歷寫成一篇圖文並茂的精彩故事！', d: P },
    ]},
    { q: '面對一本厚厚的原文書或專業科目講義，你的讀書習慣是？', e: '📖', opts: [
      { t: '喜歡自己慢慢啃，每個觀念都推導一遍，享受解題快感！', d: E },
      { t: '習慣做筆記、畫重點，然後找同學一起討論、做報告。', d: P },
      { t: '考前一個月才開始狂抱佛腳，背熟考古題就好！', d: E },
      { t: '我喜歡找資料、看 Paper，把理論應用到實際專案中。', d: P },
    ]},
    { q: '如果可以選擇，你比較喜歡哪一種測驗方式？', e: '📝', opts: [
      { t: '一翻兩瞪眼的筆試，會就會、不會就不會，最公平！', d: E },
      { t: '交報告或做專題，讓我有時間慢慢構思、完善作品。', d: P },
      { t: '口試面試，我可以當面說服教授為什麼我最棒！', d: P },
      { t: '最好都不要考…但我猜筆試比較不用看人臉色。', d: E },
    ]},
    { q: '對於未來，你有多明確的目標和規劃呢？', e: '🎯', opts: [
      { t: '超級明確！知道想研究什麼，甚至想好要找哪位教授了！', d: P },
      { t: '大概知道想走哪個領域，但具體研究什麼還在摸索中。', d: N },
      { t: '還沒想好，先考上研究所再說，反正學歷越高越好！', d: E },
      { t: '我想轉換跑道，去念一個跟大學完全不同的科系！', d: E },
    ]},
    { q: '你自認自律嗎？能每天坐在書桌前讀書 8 小時以上嗎？', e: '⏱️', opts: [
      { t: '沒問題！給我一個安靜的圖書館，我可以讀到天荒地老！', d: E },
      { t: '沒辦法一直坐著，我需要靠做實驗、討論或實作來學習。', d: P },
      { t: '只有火燒屁股（考前一週）的時候我才辦得到…', d: E },
      { t: '我能長時間專注，但比起背書，更愛寫程式或做設計。', d: P },
    ]},
    { q: '回顧大學生活，你覺得最能代表你的一句話是？', e: '💬', opts: [
      { t: '「學霸就是我，我就是學霸！」', d: P },
      { t: '「社團／系學會／打工佔滿生活，但我學到很多軟實力！」', d: P },
      { t: '「平凡就是福，安穩度過每一天，偶爾打打電動也不錯。」', d: E },
      { t: '「成績不是最頂尖，但我對某個專業科目有無比狂熱！」', d: E },
    ]},
    { q: '如果推甄沒上，你的下一步會是什麼？', e: '🚨', opts: [
      { t: '天啊！感覺世界末日，我無法承受這種打擊…', d: E },
      { t: '沒關係，多一次機會而已，我本來就有準備考試保底！', d: N },
      { t: '摸摸鼻子，乖乖去圖書館報到，準備幾個月後的考試。', d: E },
      { t: '我相信備審很強，沒上一定是學校沒眼光！哼！', d: P },
    ]},
    { q: '最後一題！你喜歡「長期抗戰」還是「速戰速決」？', e: '⚔️', opts: [
      { t: '長期抗戰！花半年甚至一年準備考試，穩紮穩打。', d: E },
      { t: '長期抗戰！花很多時間雕琢備審、修改研究計畫，做到完美。', d: P },
      { t: '速戰速決！考試就那兩天，考完就解脫了！', d: E },
      { t: '速戰速決！推甄早早放榜，大四下我就可以去玩了！', d: P },
    ]},
  ];

  var RESULTS = {
    recommend: {
      badge: '書審面試達人', rc: '#1A5D94', rcSoft: 'rgba(26,93,148,.10)',
      title: '🌟 閃亮新星！你的主戰場在【推甄】',
      desc: [
        '測驗顯示，你非常適合透過「推甄」進入研究所！推甄看重的是「整體的你」與「研究潛力」。你可能維持了亮眼成績，或積極參與專題、競賽、實習，累積了豐富的實務經驗。更重要的是，你擁有不錯的表達能力，這在面試關卡是一大優勢。',
        '推甄的邏輯是尋找『適合做研究』、『與實驗室氣場合拍』的學生。你的過往軌跡足以向教授證明：你不只會讀書，更知道如何將知識應用，並且對未來有清晰規劃。趁早準備，讓你的優勢在備審資料中閃閃發光吧！',
      ],
      adv: '你的在校成績與專題經歷是最強的武器。你習慣長期累積，能有條理地把經歷轉化為引人入勝的自傳與研究計畫；也不怯於展現自我，在講求溝通與邏輯的面試中容易脫穎而出。',
      cha: '推甄需花大量時間準備繁瑣文書，且「研究計畫」往往是大學生較不熟悉的領域。加上名額競爭激烈，頂尖校系需要非常突出的亮點才能被看見。',
      guide: [
        { h: '提早佈局', t: '大三下就要開始構思「研究計畫」，這是推甄最關鍵的決勝點。多讀相關文獻，找出感興趣且可行的題目。' },
        { h: '盤點經歷', t: '找出四年中最能證明研究能力的故事，用 STAR 原則（情境、任務、行動、結果）寫入自傳。' },
        { h: '推薦信策略', t: '盡早找熟悉你學習態度或專題表現的教授，有禮貌地邀請撰寫推薦信。' },
        { h: '模擬面試', t: '口條需要練習。找學長姐或教授模擬面試，訓練高壓下仍能清晰表達邏輯。' },
      ],
      links: [
        { t: '推甄看什麼、適合誰', href: '#recommend' },
        { t: '決定走推甄後的時程規劃', href: '/pages/resources/graduate-timeline.html' },
      ],
    },
    exam: {
      badge: '硬實力派高手', rc: '#B4741B', rcSoft: 'rgba(180,116,27,.12)',
      title: '✍️ 實力戰將！【考試】是你翻盤的絕佳舞台',
      desc: [
        '你就像一位隱藏實力的武林高手！或許過去經歷沒那麼多采多姿，或大學前幾年玩太瘋導致成績不夠亮眼，但你擁有扎實的學科基礎與強大的應試能力。考試給了你一個絕對公平的戰場，只要願意投入時間苦讀，絕對能用實力證明自己、一舉翻盤！',
        '研究所考試的評選邏輯很單純：看重對特定專業科目的深度與熟練度。同一張考卷，誰能在時間壓力下解題精準，誰就拿到門票。對想跨領域報考、或缺乏專題經驗的你來說，考試是最直接、最不看過去背景的一條路。',
      ],
      adv: '你具備極強的抗壓性與自律能力，能承受長期抗戰的孤獨；擅長歸納整理龐大的知識體系，並在選擇題或申論題中精準命中核心。對你而言，實力說話比包裝經歷更踏實。',
      cha: '考研是漫長的馬拉松，最怕中途彈性疲乏。此外，近年許多學校在考試入學加入了二階段「資料審查」或「口試」，即使筆試過了，也必須短時間內生出一份能看的基本履歷。',
      guide: [
        { h: '擬定作戰計畫', t: '盡早（大三下或大四暑假前）確定考科，規劃至少半年進度表並嚴格執行，切忌讀到哪算哪。' },
        { h: '考古題是神', t: '考前一到兩個月狂刷目標校系近五年考古題，掌握出題偏好、常考觀念並訓練答題速度。' },
        { h: '穩住心態', t: '考研路上最容易懷疑人生。找戰友討論、維持規律運動，保持身心健康才能走到最後。' },
        { h: '跨考者注意', t: '想跨考不同領域，建議提早旁聽該系所核心課程，或報名補習班，彌補本科知識落差。' },
      ],
      links: [
        { t: '考試看什麼、適合誰', href: '#exam' },
        { t: '兩條路的根本差別', href: '#two-paths' },
      ],
    },
    both: {
      badge: '穩紮穩打策略家', rc: '#5B5E86', rcSoft: 'rgba(91,94,134,.12)',
      title: '⚖️ 雙劍合璧！【推甄與考試】並行的全能型選手',
      desc: [
        '你目前的狀態非常均衡，沒有明顯偏向哪一邊。或許你有不錯的成績，但缺乏具體的專題研究經驗；又或者你對專業科目有把握，但也想先用推甄試試水溫，給自己多一個機會。',
        '這種「全能型」特質讓你有更多選擇，但也容易陷入兩頭空的風險。推甄與考試時間雖然錯開（推甄大四上、考試大四下），但準備期高度重疊。建議採取「一主一輔」的務實策略，才不會讓兩邊互相排擠。',
      ],
      adv: '你的發展非常全面，進可攻退可守。成績底子不差，同時也有一定應試能力，面對不同學校的招生策略時具備高度彈性與適應力。',
      cha: '最大的風險在「時間管理」。若暑假同時要弄專題、寫研究計畫，又要補習或念考科，很容易兩邊都做不好。加上推甄失利後，心態轉換與重新投入考試的銜接期也是考驗。',
      guide: [
        { h: '誠實評估、定出主輔', t: '分析目標校系兩邊名額比例。優勢在成績就「主攻推甄、考試保底」；優勢在解題就「主攻考試，挑幾間契合的推甄試試」。' },
        { h: '嚴格的時間切割', t: '例如規定自己每週只有兩天處理推甄資料，其餘時間專注考科；絕不因推甄進度落後就無止盡壓縮考科時間。' },
      ],
      links: [
        { t: '可以兩條都準備嗎？', href: '#both' },
        { t: '怎麼決定：問自己這幾個問題', href: '#decide' },
      ],
    },
  };

  var ARTICLE = '/pages/resources/graduate-recommend-vs-exam.html';
  var LINE = 'https://lin.ee/9ciZvbA?utm_source=website&utm_medium=cta&utm_campaign=grad-path-quiz';

  var card = document.getElementById('gpq-card');
  if (!card) return;
  var state = { step: -1, answers: [] };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  function el(t) { var d = document.createElement('div'); d.innerHTML = t.trim(); return d.firstChild; }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  function render() {
    card.innerHTML = '';
    if (state.step === -1) { card.setAttribute('data-screen', 'intro'); return intro(); }
    if (state.step >= QUESTIONS.length) { card.setAttribute('data-screen', 'result'); return result(); }
    card.setAttribute('data-screen', 'q' + state.step);
    return question();
  }

  function intro() {
    var s = el('<div class="gpq-screen gpq-intro"></div>');
    s.innerHTML =
      '<span class="gpq-kicker">研究所推甄</span>' +
      '<h1 class="gpq-h1">你適合研究所推甄，還是考試？</h1>' +
      '<p class="gpq-lead">兩條路篩的東西完全不同：推甄看整體輪廓與研究潛力，考試比專業科目的硬實力。花 3 分鐘、10 題，看看你目前的條件比較適合哪個戰場。</p>' +
      '<div class="gpq-meta">' +
        '<div class="gpq-m"><b>10 題</b><span>約 3 分鐘</span></div>' +
        '<div class="gpq-m"><b>3 種</b><span>傾向結果</span></div>' +
        '<div class="gpq-m"><b>可延伸</b><span>接知識庫文章</span></div>' +
      '</div>' +
      '<button type="button" class="gpq-btn gpq-btn-primary gpq-btn-full" id="gpq-start">開始測驗 →</button>';
    card.appendChild(s);
    document.getElementById('gpq-start').addEventListener('click', function () { state.step = 0; render(); });
  }

  function question() {
    var i = state.step, Q = QUESTIONS[i];
    var base = Math.round(i / QUESTIONS.length * 100);
    var s = el('<div class="gpq-screen"></div>');
    var optsHtml = Q.opts.map(function (o, idx) {
      var on = state.answers[i] === idx;
      return '<button type="button" class="gpq-opt" role="radio" aria-checked="' + (on ? 'true' : 'false') + '" data-idx="' + idx + '">' +
             '<span class="gpq-dot"></span><span>' + esc(o.t) + '</span></button>';
    }).join('');
    s.innerHTML =
      '<div class="gpq-prog">' +
        '<div class="gpq-track"><div class="gpq-fill" style="width:' + base + '%"></div></div>' +
        '<div class="gpq-num">' + (i + 1) + ' / ' + QUESTIONS.length + '</div>' +
      '</div>' +
      '<div class="gpq-qlabel">問題 ' + (i + 1) + '</div>' +
      '<h2 class="gpq-qtitle">' + esc(Q.q) + '<span class="gpq-qe">' + Q.e + '</span></h2>' +
      '<div class="gpq-opts" role="radiogroup" aria-label="' + esc(Q.q) + '">' + optsHtml + '</div>' +
      '<div class="gpq-nav">' +
        '<button type="button" class="gpq-btn gpq-btn-ghost" id="gpq-back">← 上一題</button>' +
        '<span class="gpq-hint">點選答案即自動前往下一題</span>' +
      '</div>';
    card.appendChild(s);
    requestAnimationFrame(function () {
      var f = s.querySelector('.gpq-fill');
      if (f) f.style.width = Math.round((i + (state.answers[i] != null ? 1 : 0)) / QUESTIONS.length * 100) + '%';
    });

    s.querySelectorAll('.gpq-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.answers[i] = parseInt(btn.dataset.idx, 10);
        s.querySelectorAll('.gpq-opt').forEach(function (b) { b.setAttribute('aria-checked', b === btn ? 'true' : 'false'); });
        var f = s.querySelector('.gpq-fill');
        if (f) f.style.width = Math.round((i + 1) / QUESTIONS.length * 100) + '%';
        var go = function () { state.step = i + 1; render(); };
        if (reduce) go(); else setTimeout(go, 260);
      });
    });
    document.getElementById('gpq-back').addEventListener('click', function () { state.step = Math.max(-1, i - 1); render(); });
  }

  function tally() {
    var c = { push: 0, exam: 0, neutral: 0 };
    state.answers.forEach(function (ans, i) { var o = QUESTIONS[i].opts[ans]; if (o) c[o.d]++; });
    return c;
  }

  function decide(c) {
    if (c.push - c.exam > 2) return 'recommend';
    if (c.exam - c.push > 2) return 'exam';
    return 'both';
  }

  function result() {
    var c = tally(), key = decide(c), R = RESULTS[key];
    var s = el('<div class="gpq-screen gpq-result"></div>');
    s.style.setProperty('--rc', R.rc);
    s.style.setProperty('--rc-soft', R.rcSoft);
    var descHtml = R.desc.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    var guideHtml = R.guide.map(function (g) {
      return '<li><span class="gpq-ck">✓</span><span><b>' + esc(g.h) + '</b>　<span class="gpq-gt">' + esc(g.t) + '</span></span></li>';
    }).join('');
    var linksHtml = R.links.map(function (l) {
      var href = l.href.charAt(0) === '#' ? (ARTICLE + l.href) : l.href;
      return '<a class="gpq-lnk" href="' + href + '">' + esc(l.t) + '<span class="gpq-arrow">→</span></a>';
    }).join('');
    s.innerHTML =
      '<span class="gpq-rbadge">' + esc(R.badge) + '</span>' +
      '<h2 class="gpq-rtitle">' + esc(R.title) + '</h2>' +
      '<p class="gpq-disc">依你的 10 題作答計算　·　傾向參考，非定論</p>' +
      '<div class="gpq-tally">' +
        '<div class="gpq-t' + (key === 'recommend' ? ' on' : '') + '"><div class="gpq-tn">' + c.push + '</div><div class="gpq-tl">推甄傾向</div></div>' +
        '<div class="gpq-t' + (key === 'exam' ? ' on' : '') + '"><div class="gpq-tn">' + c.exam + '</div><div class="gpq-tl">考試傾向</div></div>' +
        '<div class="gpq-t' + (key === 'both' ? ' on' : '') + '"><div class="gpq-tn">' + c.neutral + '</div><div class="gpq-tl">中立</div></div>' +
      '</div>' +
      '<div class="gpq-desc">' + descHtml + '</div>' +
      '<div class="gpq-grid">' +
        '<div class="gpq-box gpq-adv"><div class="gpq-rl">◆ 優勢分析</div><p>' + esc(R.adv) + '</p></div>' +
        '<div class="gpq-box gpq-cha"><div class="gpq-rl">◆ 潛在挑戰</div><p>' + esc(R.cha) + '</p></div>' +
      '</div>' +
      '<div class="gpq-guide"><div class="gpq-rl gpq-guide-h">🧭 實戰指南</div><ul>' + guideHtml + '</ul></div>' +
      '<div class="gpq-links">' + linksHtml + '</div>' +
      '<div class="gpq-cta"><a class="gpq-btn gpq-btn-full gpq-btn-cta" href="' + LINE + '" target="_blank" rel="noopener noreferrer" data-track-event="click_consultation_cta" data-ga-event="grad-path-quiz-result">不確定怎麼取捨？預約策略諮詢 →</a></div>' +
      '<div class="gpq-restart"><button type="button" id="gpq-restart">重新測驗一次</button></div>';
    card.appendChild(s);
    document.getElementById('gpq-restart').addEventListener('click', function () { state = { step: -1, answers: [] }; render(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
