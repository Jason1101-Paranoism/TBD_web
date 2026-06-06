// 情境式入口與新手必讀路線設定。
//
// 這份設定用「使用者的處境」而非「文章分類」當入口——學生與家長通常不是用
// 分類思考，而是用問題思考（「我活動很多但很散」「我是家長第一次了解」）。
//
// resources.astro（知識庫首頁頂部）與 search.astro（搜尋頁空狀態）都讀這份設定，
// 各自從 articles collection 把 slug 解析成標題與連結，不需要雙份維護。
// slug = src/content/articles/ 下的檔名（去掉 .mdx）。若 slug 對不到文章，
// 兩個頁面都會在 build 時 console.warn 提示，但不會中斷 build。

export interface Situation {
  /** 區塊錨點與追蹤用 id */
  id: string;
  /** 第一人稱處境（學生／家長的真實說法） */
  title: string;
  /** 一句說明，補充這個處境的常見卡點 */
  desc: string;
  /** 對應文章 slug，依建議閱讀順序排列（取前 3 篇顯示） */
  slugs: string[];
}

export const situations: Situation[] = [
  {
    id: 'scattered',
    title: '我活動很多，但備審看起來很散',
    desc: '不缺經歷，缺的是把它們串成一條教授看得懂的主線。',
    slugs: ['scatter-to-story', 'learning-main-thread', 'why-busy-not-strong'],
  },
  {
    id: 'side-project',
    title: '我想做 Side Project，但不知道從哪開始',
    desc: '從 0 到 1 的選題、動手，到讓評審看得懂的 README 與作品集。',
    slugs: ['side-project-from-zero', 'readme-guide', 'github-portfolio'],
  },
  {
    id: 'special-admission',
    title: '我想走特殊選才，不確定自己夠不夠格',
    desc: '先搞懂特選看的是什麼，再判斷現在的材料離標準有多遠。',
    slugs: ['special-admission-choose', 'special-admission-portfolio', 'reviewer-perspective'],
  },
  {
    id: 'graduate',
    title: '我要準備研究所推甄',
    desc: '時程、研究計畫書、聯繫教授——推甄的準備邏輯和大學申請不一樣。',
    slugs: ['graduate-timeline', 'research-proposal', 'graduate-contact-professor'],
  },
  {
    id: 'early-start',
    title: '我高一、高二，想提早準備但沒方向',
    desc: '還沒到動筆備審的階段，現在該做的是探索、累積與建立習慣。',
    slugs: ['three-year-plan', 'self-learning-sop', 'no-resources'],
  },
  {
    id: 'parent',
    title: '我是家長，第一次了解 108 課綱升學',
    desc: '先理解制度怎麼變，再找到自己真正幫得上忙、不越界的位置。',
    slugs: ['parent-how-to-help', 'parent-misconceptions', 'parent-consult-decision'],
  },
];

export interface StarterStep {
  /** 文章 slug */
  slug: string;
  /** 這一步為什麼放在這個順序——給讀者的閱讀理由 */
  note: string;
}

// 新手必讀路線：第一次來的人照順序讀，建立「為什麼準備 → 怎麼準備」的整體框架。
// 刻意只放 5 篇，避免一進來就被資訊淹沒。
export const starterPath: StarterStep[] = [
  { slug: 'high-score-not-enough', note: '先理解為什麼成績好還不夠，升學到底在比什麼。' },
  { slug: 'admission-channels-compare', note: '看懂各管道差在哪，找出最適合自己的那一條。' },
  { slug: 'learning-main-thread', note: '學會把零散經歷收斂成一條清楚的個人主線。' },
  { slug: 'reflection-in-portfolio', note: '把「我學到很多」寫成有辨識度的有效反思。' },
  { slug: 'reviewer-perspective', note: '用教授的視角回頭檢查，你的備審站不站得住。' },
];
