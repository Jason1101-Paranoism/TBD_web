// 知識庫首頁分區設定。
// resources.astro 依此設定，從 articles content collection 自動分組產生卡片。
// 每篇文章的 frontmatter `category` 必須對應到下方某個 `category` 值，
// 否則該文章不會出現在任何分區（但文章頁與搜尋頁仍會收錄）。

export interface ResourceExtraCard {
  kicker: string;
  title: string;
  href: string;
  desc: string;
  order: number;
}

export interface ResourceCategory {
  /** 區塊錨點 id，對應側邊欄連結與 IntersectionObserver */
  id: string;
  /** 側邊欄顯示文字 */
  navLabel: string;
  /** 區塊大標題 (h2) */
  sectionLabel: string;
  /** 對應文章 frontmatter 的 category 值 */
  category: string;
  /** 區塊說明段落 */
  desc: string;
  /** 非 collection 的額外卡片（例如獨立靜態頁），會與文章一起依 order 排序 */
  extraCards?: ResourceExtraCard[];
}

export const resourceCategories: ResourceCategory[] = [
  {
    id: 'overview',
    navLabel: '申請策略',
    sectionLabel: '申請策略全局觀',
    category: '申請策略',
    desc: '在備審動筆之前，先把管道選擇、選校邏輯和準備時程想清楚。',
  },
  {
    id: 'portfolio',
    navLabel: '備審製作',
    sectionLabel: '備審製作',
    category: '備審製作',
    desc: '從評審邏輯、主線建立，到自傳、讀書計畫、排版的實作指南。',
  },
  {
    id: 'materials',
    navLabel: '材料累積',
    sectionLabel: '材料累積',
    category: '材料累積',
    desc: '備審的原料從哪來——Side Project、競賽、自學、研究，如何有策略地累積有申請價值的材料。',
  },
  {
    id: 'interview',
    navLabel: '面試準備',
    sectionLabel: '面試準備',
    category: '面試準備',
    desc: '個申二階、特選面試、研究所口試——不同管道的面試邏輯不同，準備方向也不一樣。',
  },
  {
    id: 'departments',
    navLabel: '各科系指南',
    sectionLabel: '各科系申請指南',
    category: '各科系指南',
    desc: '不同科系的評審邏輯不同，備審要展示的重點也不一樣。',
  },
  {
    id: 'graduate',
    navLabel: '研究所推甄',
    sectionLabel: '研究所推甄',
    category: '研究所推甄',
    desc: '從時程規劃、研究計畫書到口試準備，研究所推甄的完整準備邏輯。',
  },
  {
    id: 'tools',
    navLabel: '工具與延伸',
    sectionLabel: '工具與延伸閱讀',
    category: '工具與延伸',
    desc: 'GitHub 作品集建置、數位工具使用，以及 AI 時代升學觀點的延伸資源。',
    extraCards: [
      {
        kicker: 'Portfolio',
        title: '高中生 Portfolio 建置指南',
        href: '/pages/portfolio-guide.html',
        desc: '從 0 開始，把三年經歷整理成教授看得懂的個人主線。含選材邏輯、結構設計與 AI prompt 工具。',
        order: 4.5,
      },
    ],
  },
];
