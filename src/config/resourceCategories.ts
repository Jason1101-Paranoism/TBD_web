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
  /**
   * 此分類文章的結尾 CTA 段落預設值（bottomCtaH2 底下那段）。
   * 文章 frontmatter 若自訂 bottomCtaP 會覆寫這段；都沒有時才用全站通用預設。
   * 由 ArticleLayout 依文章 category 取用。
   */
  ctaParagraph?: string;
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
    ctaParagraph: '升學最怕力氣用錯方向。TBD 的第一次策略諮詢會先盤點你的管道選擇、目標校系與目前的準備進度，幫你把該先做、能晚點做的事排出順序——給你一份帶得走的準備地圖，不管後續有沒有合作。',
  },
  {
    id: 'portfolio',
    navLabel: '備審製作',
    sectionLabel: '備審製作',
    category: '備審製作',
    desc: '從評審邏輯、主線建立，到自傳、讀書計畫、排版的實作指南。',
    ctaParagraph: '備審難的往往不是文筆，而是看不出自己哪些經歷值得寫、又該怎麼串成一條線。TBD 的第一次策略諮詢會陪你從現有材料找出個人主線，評估自傳、讀書計畫與反思最該補強的地方，給你具體的修改方向——不管後續有沒有繼續合作都帶得走。',
  },
  {
    id: 'materials',
    navLabel: '材料累積',
    sectionLabel: '材料累積',
    category: '材料累積',
    desc: '備審的原料從哪來——Side Project、競賽、自學、研究，如何有策略地累積有申請價值的材料。',
    ctaParagraph: '有經歷不等於有材料，關鍵是能不能轉成評審看得懂的申請價值。TBD 的第一次策略諮詢會幫你盤點手上的專題、競賽、自學或研究經歷，判斷哪些值得深化、哪些該補上，給你一份可執行的累積建議——不管後續有沒有合作都帶得走。',
  },
  {
    id: 'pre-college',
    navLabel: '升大學前準備',
    sectionLabel: '升大學前準備',
    category: '升大學前準備',
    desc: '不管是高中生想提早探索，還是準大一的暑假，升大學前真正該做的是探索、先修、作品與表達——而不是把大學課程提前念完。',
    ctaParagraph: '升大學前這段時間，真正該做的是探索、先修、作品與表達，而不是把大學課程提前念完。TBD 的第一次策略諮詢會依你的科系方向，幫你把這段時間排出可執行的節奏，讓每一步都接得上未來的申請——不管後續有沒有合作都帶得走。',
  },
  {
    id: 'interview',
    navLabel: '面試準備',
    sectionLabel: '面試準備',
    category: '面試準備',
    desc: '個申二階、特選面試、研究所口試——不同管道的面試邏輯不同，準備方向也不一樣。',
    ctaParagraph: '面試會不會緊張是其次，能不能把自己的準備講清楚才是關鍵。TBD 的第一次策略諮詢會依你要面對的面試型態——個申二階、特選或研究所口試——評估準備方向，必要時安排針對性的模擬與回饋，讓你進考場前先練過一輪。',
  },
  {
    id: 'departments',
    navLabel: '各科系指南',
    sectionLabel: '各科系申請指南',
    category: '各科系指南',
    desc: '不同科系的評審邏輯不同，備審要展示的重點也不一樣。',
    ctaParagraph: '不同科系的評審看的重點不一樣，同一份備審不會適用所有系。TBD 的第一次策略諮詢會依你的目標科系，幫你判斷備審該凸顯哪些能力、補哪些材料，讓準備對準你真正想申請的方向——不管後續有沒有合作都帶得走。',
  },
  {
    id: 'graduate',
    navLabel: '研究所推甄',
    sectionLabel: '研究所推甄',
    category: '研究所推甄',
    desc: '從時程規劃、研究計畫書到口試準備，研究所推甄的完整準備邏輯。',
    ctaParagraph: '推甄的準備邏輯和大學申請不同，研究計畫與口試往往才是勝負點。TBD 的第一次策略諮詢會協助你檢視推甄時程、研究計畫書的方向與口試準備，給你一份具體的下一步建議——不管後續有沒有合作都帶得走。',
  },
  {
    id: 'graduate-by-field',
    navLabel: '分科研究所',
    sectionLabel: '分科研究所申請（依學群）',
    category: '分科研究所申請',
    desc: '不同學門的研究所，看的研究能力與作品形式都不一樣。這裡按學群拆解推甄與申請的關鍵差異——通用的時程、套磁與口試邏輯，請搭配「研究所推甄」分區一起讀。',
    ctaParagraph: '分科研究所的勝負點，往往在研究計畫與作品如何對準目標實驗室或創作方向。TBD 的第一次策略諮詢會依你的學群與目標校系，幫你檢視選校名單、研究計畫方向與作品呈現，給你一份具體的下一步建議——不管後續有沒有合作都帶得走。',
  },
  {
    id: 'parents',
    navLabel: '給家長',
    sectionLabel: '給家長',
    category: '給家長',
    desc: '108 課綱改變了升學準備的方式，家長的角色也需要跟著調整。從理解制度、陪伴選科系，到判斷備審品質與親子溝通，幫家長找到真正幫得上忙的位置。',
    ctaParagraph: '孩子目前缺的是方向、文件，還是表達，往往不容易判斷。TBD 的第一次策略諮詢歡迎家長一起參與，我們會協助釐清孩子現在的階段與最該補強的環節，也幫您找到真正幫得上忙、又不越界的位置——不管後續有沒有合作，這份判斷都帶得走。',
  },
  {
    id: 'tools',
    navLabel: '工具與延伸',
    sectionLabel: '工具與延伸閱讀',
    category: '工具與延伸',
    desc: 'GitHub 作品集建置、數位工具使用，以及 AI 時代升學觀點的延伸資源。',
    ctaParagraph: '做了東西，卻擔心評審看不懂，是很常見的問題。TBD 的第一次策略諮詢會協助你檢查作品集結構、GitHub 與線上呈現，讓你的 README、Demo 與個人頁面真的說清楚你做了什麼、為什麼值得看——不管後續有沒有合作都帶得走。',
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
