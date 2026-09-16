// 官網圖表資料（來源：Drive「官網 SOP」資料夾，YY 2026-09-04 產出的 HTML 圖檔）
//
// 這三份圖原本是 1200px 固定寬的獨立 HTML 檔，無法直接內嵌（自帶 :root 變數會與站上
// design token 互撞，手機也會橫向溢出）。改成資料 + 元件後由 JourneyMatrix / PlanCompare
// 渲染，文案一字不改，樣式一律走 --tbd-* token。
//
// 對應關係（見 Drive「SOP 圖檔放置」文件）：
//   journeyMap      → TBD_Studio_CJM_web_v3.html   → process.astro
//   urgentJourneyMap→ 備審急件_CJM_web_v2.html      → services.astro
//   interviewPlans  → 面試衝刺方案比較圖_web_v2.html → services.astro
//
// 注意：同資料夾的 TBD_Studio_CJM_web_v2.html 已被 v3 取代，SOP 未列入，不落地。

export type MatrixCell =
  | { text: string }
  | { strong: string; text: string }
  | { tags: string[] };

export interface MatrixRow {
  label: string;
  /** 成果列用淡底強調，與原圖的 .emphasis 對應 */
  emphasis?: boolean;
  cells: MatrixCell[];
}

export interface EmotionCurve {
  title: string;
  sub: string;
  /** viewBox 高度；折線與基準線的座標都依這個高度 */
  viewBoxHeight: number;
  baselineY: number;
  path: string;
  points: Array<{ x: number; y: number }>;
  labels: string[];
}

export interface JourneyMatrixData {
  kicker: string;
  title: string;
  intro: string;
  aside: { title: string; items: string[] };
  headLabel: string;
  phases: Array<{ no: string; title: string; desc: string }>;
  rows: MatrixRow[];
  emotion: EmotionCurve;
  method?: { title: string; cards: Array<{ en: string; zh: string; desc: string }> };
}

export const journeyMap: JourneyMatrixData = {
  kicker: 'CUSTOMER JOURNEY MAP',
  title: '從第一次接觸，到把申請準備變成可追蹤的成果',
  intro:
    'TBD Studio 的合作不是一次性的文件修改，而是從理解需求、確認方向、建立策略，到執行與交付的完整旅程。每一個階段都有清楚的下一步、可檢視的成果與對應的溝通節點。',
  aside: {
    title: '合作過程中，你可以清楚看見',
    items: ['交付物可驗收', '進度可追蹤', '版本可回溯', '方向與策略可說明'],
  },
  headLabel: '合作旅程',
  phases: [
    { no: '01', title: '初次接觸', desc: '從模糊問題開始，先確認真正需要處理什麼。' },
    { no: '02', title: '初步對談', desc: '補齊資訊，形成可評估的申請輪廓。' },
    { no: '03', title: '方案提案', desc: '確認合作範圍、節奏與實際交付內容。' },
    { no: '04', title: '正式開案', desc: '建立固定協作方式與專案管理架構。' },
    { no: '05', title: '專案執行', desc: '把方向與策略轉成可執行的申請成果。' },
    { no: '06', title: '成果與支持', desc: '完成交付，也留下未來可延伸使用的資產。' },
  ],
  rows: [
    {
      label: '學生／家長此時需要',
      cells: [
        { text: '知道自己現在真正卡在哪裡，而不是先急著做文件。' },
        { text: '理解自身條件與目標之間的落差，確認優先順序。' },
        { text: '知道合作後實際會做什麼、需要多久、會得到什麼。' },
        { text: '清楚接下來如何配合，以及所有資料與進度放在哪裡。' },
        { text: '知道每一步是否真的有幫助到申請，並持續看到進展。' },
        { text: '確認成果完成，也能理解自己為什麼這樣準備。' },
      ],
    },
    {
      label: 'TBD 如何協助',
      cells: [
        { strong: '初步需求定位', text: '蒐集背景、目標校系、目前進度與時間限制。' },
        { strong: '策略診斷', text: '釐清申請目標、經歷結構、主要優勢與缺口。' },
        { strong: '方案規劃', text: '依需求拆解工作範圍、時程與合作形式。' },
        { strong: '專案化管理', text: '建立協作空間、固定節奏與版本管理方式。' },
        { strong: '專業執行', text: '從素材盤點、定位、策略到文件與面試準備。' },
        { strong: '成果檢核', text: '完成最終交付、回顧與後續支持。' },
      ],
    },
    {
      label: '主要接觸點',
      cells: [
        { tags: ['官網', 'LINE OA', 'IG / Threads', '轉介紹', '免費諮詢'] },
        { tags: ['前置表單', '策略諮詢', '資料上傳'] },
        { tags: ['方案說明', '時程討論', '費用／合約'] },
        { tags: ['Drive', 'Notion', '專案群組'] },
        { tags: ['課程', '文件共編', '模擬面試', '回饋報告'] },
        { tags: ['最終交付', '成果回顧', '後續追蹤'] },
      ],
    },
    {
      label: '階段成果',
      emphasis: true,
      cells: [
        { strong: '需求定位', text: '確認真正要處理的問題。' },
        { strong: '申請策略診斷', text: '整理定位、缺口與準備順序。' },
        { strong: '專屬合作方案', text: '定義目標、里程碑與交付物。' },
        { strong: '執行架構', text: '所有進度、版本與下一步都有固定位置。' },
        { strong: '可驗收交付物', text: '如素材盤點、策略報告、備審版本、面試題庫等。' },
        { strong: '可延伸申請資產', text: '不只完成一次申請，也保留可再次使用的結構與方法。' },
      ],
    },
  ],
  emotion: {
    title: '旅程中的感受變化',
    sub: '從不確定，到逐步建立方向、節奏與掌握感',
    viewBoxHeight: 100,
    baselineY: 78,
    path: 'M20 68 C120 75,140 55,190 59 S300 68,360 49 S470 40,535 45 S650 58,710 35 S850 25,980 19',
    points: [
      { x: 20, y: 68 },
      { x: 190, y: 59 },
      { x: 360, y: 49 },
      { x: 535, y: 45 },
      { x: 710, y: 35 },
      { x: 980, y: 19 },
    ],
    labels: ['焦慮／模糊', '被理解', '知道下一步', '合作有節奏', '看見進展', '有掌握感'],
  },
  method: {
    title: 'TBD METHOD',
    cards: [
      { en: 'MAPPING', zh: '盤點現況', desc: '把條件、素材與限制整理成可分析的地圖。' },
      { en: 'POSITIONING', zh: '建立定位', desc: '決定這個人要被如何理解，而不是單純堆疊經歷。' },
      { en: 'STRATEGY', zh: '拆解策略', desc: '把目標拆成有順序、可執行的行動與版本。' },
      { en: 'ASSET DELIVERY', zh: '完成交付', desc: '把準備過程轉成可驗收、可複用的申請資產。' },
    ],
  },
};

export const urgentJourneyMap: JourneyMatrixData = {
  kicker: 'URGENT APPLICATION SUPPORT · CUSTOMER JOURNEY MAP',
  title: '備審急件，也能用清楚流程把有限時間用在最重要的地方',
  intro:
    '當申請時程已經很緊，真正重要的不是把所有事情一次做完，而是快速判斷優先順序、縮小範圍，並在有限時間內完成最關鍵的備審準備。',
  aside: {
    title: '急件支援的核心',
    items: [
      '先判斷案件是否可行，再決定投入方式',
      '先補最關鍵缺口，不平均分配時間',
      '每個階段都有明確輸出與下一步',
      '急件依然保留策略、品質與版本管理',
    ],
  },
  headLabel: '急件旅程',
  phases: [
    { no: '01', title: '急件諮詢', desc: '提出需求與截止時間，先確認案件狀況。' },
    { no: '02', title: '初步了解', desc: '補齊背景與申請目標，快速形成案件輪廓。' },
    { no: '03', title: '資料盤點', desc: '檢視現有備審與素材，找出最需要補強的位置。' },
    { no: '04', title: '策略規劃', desc: '確認可行範圍、優先順序與實際執行方案。' },
    { no: '05', title: '製作與修正', desc: '集中處理最關鍵文件與申請內容。' },
    { no: '06', title: '最終交付', desc: '完成檢核、修正與版本確認，進入送件準備。' },
  ],
  rows: [
    {
      label: '學生／家長此時需要',
      cells: [
        { text: '先知道「現在還來不來得及」，以及哪些事情必須優先處理。' },
        { text: '快速讓顧問理解自己的背景、校系目標與目前卡點。' },
        { text: '知道現有資料哪些能用、哪些不足、哪些已經來不及重做。' },
        { text: '確認時間有限時，真正值得投入的是哪些項目。' },
        { text: '在短時間內完成重點內容，又不失去結構與一致性。' },
        { text: '確認版本正確、內容完整，避免急件最後因細節出錯。' },
      ],
    },
    {
      label: 'TBD 如何協助',
      cells: [
        { strong: '急件初判', text: '確認截止時間、需求範圍與是否符合可執行條件。' },
        { strong: '快速釐清', text: '透過前置資訊與策略諮詢整理申請目標與背景。' },
        { strong: '資料診斷', text: '盤點既有備審、經歷與素材，標示主要缺口。' },
        { strong: '策略縮限', text: '依剩餘時間重新排序工作，定義可完成與暫不處理項目。' },
        { strong: '集中執行', text: '優先處理高影響內容，進行文件、架構與表達修正。' },
        { strong: '最終把關', text: '完成一致性、版本與送件前檢核。' },
      ],
    },
    {
      label: '主要接觸點',
      cells: [
        { tags: ['LINE OA', '急件詢問', '截止時間'] },
        { tags: ['前置表單', '策略諮詢', '基本資料'] },
        { tags: ['Drive', '現有備審', '經歷素材'] },
        { tags: ['方案確認', '時程安排', '優先順序'] },
        { tags: ['文件共編', '顧問回饋', '版本修正'] },
        { tags: ['最終檢核', '版本確認', '交付'] },
      ],
    },
    {
      label: '你需要做的事',
      cells: [
        { text: '提供基本資訊、目標校系與明確截止時間。' },
        { text: '填寫前置資訊，補充目前進度與主要需求。' },
        { text: '提供現有備審資料、作品與相關檔案。' },
        { text: '確認合作範圍與時程，配合資料補件與決策。' },
        { text: '依回饋快速回覆、補資料並確認版本。' },
        { text: '確認最終內容與送件版本。' },
      ],
    },
    {
      label: '階段成果',
      emphasis: true,
      cells: [
        { strong: '急件可行性判斷', text: '確認案件是否可承接與主要時間風險。' },
        { strong: '案件輪廓', text: '明確整理需求、目標與關鍵限制。' },
        { strong: '缺口清單', text: '辨識可直接使用、需補強與應捨棄的內容。' },
        { strong: '急件執行策略', text: '形成優先順序、分工與版本節點。' },
        { strong: '核心備審成果', text: '完成最重要的文件與內容修正。' },
        { strong: '最終交付版本', text: '完成送件前檢核與整理。' },
      ],
    },
  ],
  emotion: {
    title: '急件旅程中的感受變化',
    sub: '從「來不及了」到「知道現在最重要的是什麼」',
    viewBoxHeight: 96,
    baselineY: 76,
    path: 'M20 70 C120 76,150 60,190 61 S310 67,360 48 S470 40,535 44 S650 55,710 35 S850 29,980 20',
    points: [
      { x: 20, y: 70 },
      { x: 190, y: 61 },
      { x: 360, y: 48 },
      { x: 535, y: 44 },
      { x: 710, y: 35 },
      { x: 980, y: 20 },
    ],
    labels: ['焦慮／時間壓力', '被理解', '知道缺口', '知道取捨', '看見進度', '完成並可送件'],
  },
};

export interface PlanCompareData {
  kicker: string;
  title: string;
  lead: string;
  note: string;
  headLabel: string;
  // 原圖的三欄標了 PLAN A / B / C，但 services.astro 同一頁的「怎麼開始合作」已經有
  // 方案 A–D（備審健檢／備審重構／面試訓練／全程陪跑）。兩套不是同一個軸、也不互相取代
  // ——面試三件套是強度分級，四方案是跨服務類型——但同頁出現兩組 A/B/C 會讓讀者誤以為
  // 有對應關係。因此拿掉字母標籤，只留三個名稱（LR 2026-09-12 決定，未等 YY 回覆）。
  plans: Array<{ name: string; desc: string; badge?: string }>;
  rows: Array<{
    label: string;
    cells: Array<{ strong?: string; text?: string; stars?: string; footnote?: string }>;
  }>;
  boxes: Array<{ title: string; steps?: string[]; desc?: string }>;
}

export const interviewPlans: PlanCompareData = {
  kicker: 'INTERVIEW PREPARATION',
  title: '依你的準備狀態，選擇適合的面試衝刺方式',
  lead:
    '三種方案對應不同程度的準備需求：從快速診斷、實戰修正，到多校系與高強度陪伴。先看自己目前最需要的是「找問題」、「練實戰」，還是「完整陪跑」。',
  note: '本比較圖僅呈現服務內容與適合情境，不顯示價格資訊',
  headLabel: '比較項目',
  plans: [
    { name: '基礎診斷方案', desc: '適合觀念建立與快速抓出個人優缺點。' },
    {
      name: '實戰衝刺方案',
      desc: '適合需要擬真演練、修正表達邏輯與臨場應變。',
      badge: '熱門推薦',
    },
    { name: '尊榮全套陪伴方案', desc: '適合高階、多校系或需要完整高強度指導。' },
  ],
  rows: [
    {
      label: '適合對象',
      cells: [
        { text: '對面試已有基本概念，需要快速抓出個人優缺點者。' },
        { text: '需要擬真情境演練，並修正表達邏輯與臨場應變者。' },
        { text: '跨多個不同學群，需要全方位與高階指導者。' },
      ],
    },
    {
      label: '核心服務內容',
      cells: [
        { strong: '1 次線上審稿與核心問題梳理', text: '60 分鐘，聚焦申請內容與高機率面試問題。' },
        { strong: '2 次模擬面試＋擬答架構優化', text: '每次 60 分鐘，從答題內容到實戰表現持續修正。' },
        { strong: '3 次全真模擬面試', text: '包含肢體儀態指導與影音回放分析。' },
      ],
    },
    {
      label: '面試題庫',
      cells: [
        { text: '提供通用歷屆題庫電子檔。' },
        { text: '提供客製化校系專屬題庫＋擬答範本。' },
        { text: '客製化題庫＋高階臨場機上題／團體面試攻防庫。' },
      ],
    },
    {
      label: '模擬演練',
      cells: [
        { text: '無正式模擬，以口頭指導與示範為主。' },
        { text: '2 次 1-on-1 實戰模擬。' },
        { text: '3 次 1-on-1 實戰模擬，含黑臉／白臉雙考官模擬。' },
      ],
    },
    {
      label: '答疑與陪伴',
      cells: [
        { text: '文字諮詢 3 天。' },
        { text: '文字諮詢至面試前一日。' },
        { text: '文字＋語音諮詢，陪伴至所有面試結束。' },
      ],
    },
    {
      label: '推薦指數',
      cells: [
        { stars: '★★★☆☆' },
        { stars: '★★★★★', footnote: '多數學生會選擇此方案作為主要衝刺方式。' },
        { stars: '★★★★☆' },
      ],
    },
    {
      label: '怎麼選',
      cells: [
        { strong: '先找問題', text: '如果你主要需要的是快速定位弱點與建立答題方向。' },
        { strong: '需要真正練起來', text: '如果你已經知道大致方向，但需要實戰修正與臨場訓練。' },
        { strong: '多校系／高強度需求', text: '如果你需要多輪模擬、跨校系準備與更完整陪伴。' },
      ],
    },
  ],
  boxes: [
    {
      title: 'TBD 面試準備的重點',
      steps: ['問題定位', '擬答架構', '實戰模擬', '表達修正', '臨場應變'],
    },
    {
      title: '還不確定適合哪一種？',
      desc: '可先透過初步對談確認目前準備狀態，再依面試時程、校系數量與需要補強的程度選擇。',
    },
  ],
};
