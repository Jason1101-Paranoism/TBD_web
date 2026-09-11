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
    // 這篇屬於哪個主題指南（hub）。值是 src/pages/pages/guides/ 底下的檔名。
    //
    // 為什麼需要它：麵包屑原本只用 category 對應指南，但「材料累積」與「工具與延伸」
    // 這兩個分類各自橫跨好幾個系列（Side Project／競賽／GitHub／AI 時代／研究自學），
    // 一個 category 對不到一個 hub，結果那幾個指南沒有任何文章連回去——
    // hub-and-spoke 只有 hub 沒有 spoke（SEO 報告 S-11／S-12）。
    guideSlug: z.string().optional(),
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

    // 答案先行的重點框（A-06）。放在導言之後、內文之前。
    //
    // 為什麼需要：本站文章的導言多半是「誤區鉤子」（先講一個常見的錯誤想法再推翻它）。
    // 人讀得懂那是反例，但 AI 摘要抽首段時很容易把反例當成本文的結論。
    // 重點框的作用是讓「答案」出現在反例之前，抽首段抽到的就是對的。
    //
    // 內容一律從文章本身來，不得新增文章沒講的主張、數字或承諾。
    keyTakeaways: z.array(z.string()).optional(),

    // 步驟型文章的 HowTo schema（A-05）。只有**真的是有序步驟**的文章才填——
    // 時程型（大三下→暑假→大四上）、清單型（第 1–4 週）、流程型（Step 1–5）。
    // 三層決策框架那種「並列的判斷面向」不算，硬掛會讓結構化資料失真。
    // href 是該步驟在文章裡的錨點，會變成 HowToStep 的 url。
    howToSteps: z.array(z.object({
      name: z.string(),
      text: z.string(),
      href: z.string().optional(),
    })).optional(),
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
  }),
});

export const collections = { articles };
