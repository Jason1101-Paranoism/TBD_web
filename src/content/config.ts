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
  }),
});

export const collections = { articles };
