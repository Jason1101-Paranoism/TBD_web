import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    description: z.string(),
    // 發布日 / 最後更新日（給文章 schema 的 datePublished / dateModified）
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    kicker: z.string(),
    lead: z.string(),

    // 知識庫分類（resources 首頁分區依據，必填）
    category: z.string(),
    // 同分類內的顯示順序（小到大），未填排最後
    order: z.number().default(999),
    // 準備階段 / 目標讀者 / 科系群（搜尋頁多維篩選用，可選）
    stage: z.array(z.string()).default([]),
    audience: z.array(z.string()).default([]),
    departmentGroup: z.string().optional(),
    // 研究所申請系列的階段（1–7），用來建立「階段 × 軌道」矩陣導覽
    gradStage: z.number().optional(),
    // 所屬主題指南（可選）。填了會蓋過由 category 推導的預設值，
    // 用在「這篇的主題有專屬指南，但它的 category 對不到那個指南」的情況
    // （例：AI 時代、GitHub 兩個指南的文章分散在多個 category）。
    // 值是 GUIDE_BY_KEY 的鍵，見 src/layouts/ArticleLayout.astro。
    guide: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    updatedAt: z.string().optional(),

    bodyClass: z.string().default('sub-page article-page'),
    sitemap: z.boolean().default(true),
    sidebarCtaText: z.string(),
    sidebarCtaUtm: z.string(),
    bottomCtaH2: z.string(),
    bottomCtaP: z.string().optional(),
    bottomCtaUtm: z.string(),
    tocItems: z.array(z.object({
      href: z.string(),
      label: z.string(),
    })),
    relatedArticles: z.array(z.object({
      badge: z.string(),
      title: z.string(),
      href: z.string(),
      desc: z.string(),
    })),
    // 常見問題（可選）：填了就自動在文末渲染 FAQ 區塊 + FAQPage 結構化資料
    faqItems: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).optional(),

    // 重點速覽（3–5 條，答案先行）。渲染在 lead 之後、第一個 section 之前。
    // 為什麼要這個欄位：站上的 lead 幾乎都是「誤區鉤子」開場（「很多人以為…」），
    // 對人類讀者有效，但生成式引擎抽首段當答案時，抽到的會是那個反例。
    // 這個框負責把「這篇的結論是什麼」用完整句子講一次，讓摘要抽得到對的東西。
    // 每條要能單獨成立——被單抽出來引用時仍然看得懂，不能是「它有三個好處」這種指代句。
    keyTakeaways: z.array(z.string()).optional(),

    // 步驟／時程型文章的 HowTo 結構化資料（可選）。填了才輸出，不要為了有而有：
    // 只有「照著做會完成一件事」的文章適用（時程規劃、檢核清單、投稿流程）。
    howToSteps: z.array(z.object({
      name: z.string(),
      text: z.string(),
    })).optional(),
    // HowTo 的完成時間，ISO 8601 期間格式（例：P6M＝六個月）。可選。
    howToTotalTime: z.string().optional(),
  }),
});

export const collections = { articles };
